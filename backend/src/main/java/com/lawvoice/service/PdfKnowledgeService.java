package com.lawvoice.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PdfKnowledgeService {
    private final String configuredPdfPath;
    private final AtomicReference<PdfIndex> cached = new AtomicReference<>();

    public PdfKnowledgeService(@Value("${LAWVOICE_PDF_PATH:}") String configuredPdfPath) {
        this.configuredPdfPath = configuredPdfPath == null ? "" : configuredPdfPath.trim();
    }

    public PdfStatus status() {
        PdfIndex index = cached.get();
        return new PdfStatus(resolvePdfPath(), index != null, index == null ? 0 : index.chunks().size(), index == null ? "" : index.error());
    }

    public List<String> retrieve(String query, int maxChunks) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        PdfIndex index = ensureLoaded();
        if (index == null || index.chunks().isEmpty()) {
            return List.of();
        }
        Set<String> terms = tokenize(query);
        if (terms.isEmpty()) {
            return List.of();
        }

        return index.chunks().stream()
                .map(chunk -> new ScoredChunk(chunk, score(chunk.textLower(), terms)))
                .filter(scored -> scored.score() > 0)
                .sorted(Comparator.comparingInt(ScoredChunk::score).reversed())
                .limit(Math.max(1, maxChunks))
                .map(scored -> scored.chunk().text())
                .toList();
    }

    private int score(String textLower, Set<String> terms) {
        int score = 0;
        for (String t : terms) {
            if (t.length() < 2) continue;
            if (textLower.contains(t)) score += (t.length() >= 6 ? 3 : 1);
        }
        return score;
    }

    private Set<String> tokenize(String query) {
        String cleaned = query
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^\\p{L}\\p{N}\\s]+", " ")
                .replaceAll("\\s+", " ")
                .trim();
        if (cleaned.isBlank()) return Set.of();
        String[] parts = cleaned.split(" ");
        Set<String> out = new HashSet<>();
        for (String p : parts) {
            if (p.isBlank()) continue;
            if (p.length() <= 1) continue;
            out.add(p);
        }
        return out;
    }

    private PdfIndex ensureLoaded() {
        PdfIndex existing = cached.get();
        if (existing != null) return existing;
        synchronized (cached) {
            PdfIndex again = cached.get();
            if (again != null) return again;
            PdfIndex built = buildIndex();
            cached.set(built);
            return built;
        }
    }

    private PdfIndex buildIndex() {
        String path = resolvePdfPath();
        if (path.isBlank()) {
            return new PdfIndex(List.of(), "LAWVOICE_PDF_PATH is not set and default PDF is missing.");
        }
        File file = new File(path);
        if (!file.exists()) {
            return new PdfIndex(List.of(), "PDF not found at: " + path);
        }
        try (PDDocument doc = Loader.loadPDF(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String text = stripper.getText(doc);
            List<PdfChunk> chunks = chunk(text);
            return new PdfIndex(chunks, "");
        } catch (IOException ex) {
            return new PdfIndex(List.of(), ex.getClass().getSimpleName() + ": " + ex.getMessage());
        }
    }

    private List<PdfChunk> chunk(String text) {
        if (text == null) return List.of();
        String cleaned = text
                .replace('\u0000', ' ')
                .replaceAll("[ \\t]+", " ")
                .replaceAll("\\n{3,}", "\n\n")
                .trim();
        if (cleaned.isBlank()) return List.of();

        String[] paras = cleaned.split("\\n\\n+");
        List<PdfChunk> out = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        int target = 900;
        int max = 1400;

        for (String p : paras) {
            String para = p.trim();
            if (para.isBlank()) continue;
            if (current.length() == 0) {
                current.append(para);
            } else if (current.length() + 2 + para.length() <= max) {
                current.append("\n\n").append(para);
            } else {
                addChunk(out, current.toString());
                current.setLength(0);
                current.append(para);
            }
            if (current.length() >= target) {
                addChunk(out, current.toString());
                current.setLength(0);
            }
        }
        if (current.length() > 0) {
            addChunk(out, current.toString());
        }
        return out;
    }

    private void addChunk(List<PdfChunk> out, String text) {
        String trimmed = text == null ? "" : text.trim();
        if (trimmed.length() < 80) return;
        out.add(new PdfChunk(trimmed, trimmed.toLowerCase(Locale.ROOT)));
    }

    private String resolvePdfPath() {
        if (!configuredPdfPath.isBlank()) return configuredPdfPath;
        String home = System.getProperty("user.home", "");
        if (!home.isBlank()) {
            String guess = home + File.separator + "Downloads" + File.separator + "20240716890312078.pdf";
            if (new File(guess).exists()) return guess;
        }
        return "";
    }

    public record PdfStatus(String pdfPath, boolean loaded, int chunks, String error) {}
    private record PdfChunk(String text, String textLower) {}
    private record PdfIndex(List<PdfChunk> chunks, String error) {}
    private record ScoredChunk(PdfChunk chunk, int score) {}
}

