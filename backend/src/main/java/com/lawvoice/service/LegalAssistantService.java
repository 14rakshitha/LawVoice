package com.lawvoice.service;

import com.lawvoice.dto.AskRequest;
import com.lawvoice.dto.AskResponse;
import com.lawvoice.dto.EmergencyItem;
import com.lawvoice.dto.FaqItem;
import com.lawvoice.dto.LawyerItem;
import com.lawvoice.model.QueryHistory;
import com.lawvoice.repository.QueryHistoryRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class LegalAssistantService {
    private final QueryHistoryRepository historyRepository;

    public LegalAssistantService(QueryHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    public AskResponse answer(AskRequest request) {
        String query = request.query().toLowerCase(Locale.ROOT);
        AskResponse response;
        if (query.contains("fir") || query.contains("complaint") || query.contains("police") || query.contains("முதல் தகவல்") || query.contains("புகார்") || query.contains("காவல்")) {
            response = firResponse();
        } else if (query.contains("tenant") || query.contains("rent") || query.contains("landlord") || query.contains("வாடகை") || query.contains("வீட்டு உரிமையாளர்")) {
            response = tenantResponse();
        } else if (query.contains("consumer") || query.contains("refund") || query.contains("product") || query.contains("நுகர்வோர்") || query.contains("பணத்திருப்பு") || query.contains("பொருள்")) {
            response = consumerResponse();
        } else if (query.contains("women") || query.contains("harassment") || query.contains("safety") || query.contains("பெண்") || query.contains("துன்புறுத்தல்") || query.contains("பாதுகாப்பு")) {
            response = womenSafetyResponse();
        } else {
            response = generalResponse();
        }

        QueryHistory history = new QueryHistory();
        history.setUserId(request.userId());
        history.setTopic(response.topic());
        history.setQueryText(request.query());
        history.setResponseText(response.summary());
        historyRepository.save(history);
        return response;
    }

    public AskResponse firResponse() {
        return new AskResponse(
                "முதல் தகவல் அறிக்கை",
                "குற்றம் நடந்திருந்தால் அருகிலுள்ள காவல் நிலையத்தில் புகார் அளிக்கலாம். புகார் ஏற்க மறுத்தால் மேல் அதிகாரியை அணுகலாம் அல்லது அதிகாரப்பூர்வ இணைய புகார் வாயிலைப் பயன்படுத்தலாம்.",
                List.of("சம்பவத்தின் தேதி, நேரம், இடம், உண்மைகள் ஆகியவற்றை எழுதுங்கள்.", "அடையாளச் சான்று மற்றும் கிடைக்கும் ஆதாரங்களை எடுத்துச் செல்லுங்கள்.", "புகாரை எழுத்தாக அல்லது வாய்மொழியாக தெளிவாக அளிக்கவும்.", "பதிவு எண் மற்றும் நகலை கேளுங்கள்."),
                List.of("புகார் அளிக்கும் உரிமை உங்களுக்கு உள்ளது.", "பெண்கள் தொடர்பான வழக்குகளில் பெண் அதிகாரியின் ஆதரவை கேட்கலாம்.", "புகார் மறுக்கப்பட்டால் எழுத்து காரணம் கேட்கலாம் அல்லது மேல்முறையீடு செய்யலாம்."),
                List.of("உடனடி ஆபத்து இருந்தால் 112 அழைக்கவும்.", "புகார் நகலை பாதுகாப்பாக வைத்திருங்கள்.", "தொழில்முறை உதவி தேவைப்பட்டால் அருகிலுள்ள வழக்கறிஞரை தொடர்புகொள்ளுங்கள்."),
                "இது பொது சட்ட விழிப்புணர்வு மட்டுமே. குறிப்பிட்ட வழக்குக்கு தகுதியான வழக்கறிஞரிடம் ஆலோசனை பெறுங்கள்."
        );
    }

    private AskResponse tenantResponse() {
        return new AskResponse(
                "வாடகையாளர் உரிமைகள்",
                "எழுத்து வாடகை ஒப்பந்தம், பணம் செலுத்திய ரசீதுகள், அறிவிப்பு காலம், பராமரிப்பு பொறுப்புகள் முக்கியம். வாய்மொழி ஏற்பாடுகள் போதுமான பாதுகாப்பு தராமல் இருக்கலாம்.",
                List.of("ஒப்பந்தத்தைப் படித்து நகலை வைத்திருங்கள்.", "ஒவ்வொரு பணம் செலுத்தலுக்கும் ரசீது சேகரிக்கவும்.", "வீடு காலி செய்யச் சொன்னால் எழுத்து அறிவிப்பை கேளுங்கள்."),
                List.of("அடிப்படை வசதிகளை கேட்கலாம்.", "வீடு காலி செய்யச் செய்வதற்கு பொதுவாக சட்டப்படி அறிவிப்பும் நடைமுறையும் தேவை."),
                List.of("ஒப்பந்தம் மற்றும் ரசீதுகளை சேமிக்கவும்.", "பிரச்சினை தொடர்ந்தால் சட்ட உதவி மையம் அல்லது வழக்கறிஞரை தொடர்புகொள்ளுங்கள்."),
                "இது பொது வழிகாட்டல் மட்டுமே."
        );
    }

    private AskResponse consumerResponse() {
        return new AskResponse(
                "நுகர்வோர் உரிமைகள்",
                "குறைபாடுள்ள பொருட்கள், மோசமான சேவை, தவறான விளம்பரங்கள், பாதுகாப்பற்ற பொருட்கள், அதிக கட்டணம் ஆகியவற்றுக்கு நுகர்வோர் புகார் அளிக்கலாம்.",
                List.of("பில்கள், உத்தரவாத அட்டைகள், செய்தி பதிவுகள் ஆகியவற்றை சேமிக்கவும்.", "விற்பனையாளர் அல்லது சேவை வழங்குநருக்கு எழுத்துப் புகார் அனுப்புங்கள்.", "தீர்வு இல்லையெனில் நுகர்வோர் உதவி எண் அல்லது நுகர்வோர் ஆணையத்தை தொடர்புகொள்ளுங்கள்."),
                List.of("பாதுகாப்பான பொருட்கள் மற்றும் சேவைகள் பெறும் உரிமை உங்களுக்கு உள்ளது.", "தெளிவான தகவல் பெறும் உரிமை உங்களுக்கு உள்ளது.", "பழுது, மாற்று, பணத்திருப்பு அல்லது இழப்பீடு கேட்கலாம்."),
                List.of("நுகர்வோர் உதவி எண் 1915 அழைக்கவும்.", "வழக்கின் மதிப்பு மற்றும் தன்மை அடிப்படையில் சரியான மன்றத்தைத் தேர்வு செய்யுங்கள்."),
                "இது பொது நுகர்வோர் விழிப்புணர்வு."
        );
    }

    private AskResponse womenSafetyResponse() {
        return new AskResponse(
                "பெண்கள் பாதுகாப்பு",
                "துன்புறுத்தல், மிரட்டல், குடும்ப வன்முறை, பின்தொடர்தல் அல்லது உடனடி ஆபத்து உள்ள சூழலில் முதலில் தனிப்பட்ட பாதுகாப்பு முக்கியம்.",
                List.of("பாதுகாப்பான இடத்திற்கு செல்லுங்கள்.", "112 அல்லது 181 அழைக்கவும்.", "ஆதாரங்களை மாற்றாமல் பாதுகாக்கவும்.", "நீங்கள் எங்கே இருக்கிறீர்கள் என்பதை நம்பகமான ஒருவரிடம் தெரிவிக்கவும்."),
                List.of("பெண் அதிகாரியின் ஆதரவை கேட்கலாம்.", "தனியுரிமை மற்றும் பாதுகாப்பை கோரலாம்.", "இலவச சட்ட உதவி கிடைக்கலாம்."),
                List.of("அருகிலுள்ள காவல் நிலையம் அல்லது பெண்கள் உதவி மையத்தை தொடர்புகொள்ளுங்கள்.", "தேவைப்பட்டால் உடனடியாக மருத்துவ உதவி பெறுங்கள்."),
                "அவசரநிலையில் உடனடியாக அதிகாரப்பூர்வ உதவி எண்ணை அழைக்கவும்."
        );
    }

    private AskResponse generalResponse() {
        return new AskResponse(
                "பொது சட்ட உதவி",
                "இந்த செயலி எளிய மொழியில் முதல் நிலை சட்ட விழிப்புணர்வு வழங்குகிறது. தேதி, இடம், ஆவணங்கள், தொடர்புடைய நபர்கள், ஆதாரங்கள் ஆகியவை எந்த சட்ட சிக்கலுக்கும் முக்கியம்.",
                List.of("சம்பவத்தை நேர வரிசையில் எழுதுங்கள்.", "ஆதாரங்களை தனியாக சேமிக்கவும்.", "சரியான அதிகாரி அல்லது அலுவலகத்தைத் தேர்வு செய்யுங்கள்.", "தேவைப்பட்டால் சரிபார்க்கப்பட்ட வழக்கறிஞரை தொடர்புகொள்ளுங்கள்."),
                List.of("சட்ட உதவி கேட்கும் உரிமை உங்களுக்கு உள்ளது.", "ரசீது, புகார் எண் அல்லது குறிப்பு எண் கேட்கலாம்."),
                List.of("தொடர்புடைய கேள்வி பதில்கள் மற்றும் வழிகாட்டி பக்கங்களைப் படிக்கவும்.", "நிலை அவசரமானதாக இருந்தால் அவசர எண்களைப் பயன்படுத்தவும்."),
                "இது தொழில்முறை சட்ட ஆலோசனைக்கு மாற்றாகாது."
        );
    }

    public List<FaqItem> faqs() {
        return List.of(
                new FaqItem("fir", "காவல் உரிமைகள்", "காவல்துறை என் புகாரை மறுத்தால் என்ன செய்யலாம்?", "மேல் அதிகாரியிடம் எழுத்துப் புகார் அனுப்பி சமர்ப்பித்த ஆதாரத்தை வைத்திருங்கள்."),
                new FaqItem("tenant", "வாடகை", "வீட்டு உரிமையாளர் திடீரென காலி செய்யச் சொன்னால் என்ன செய்வது?", "நடவடிக்கை எடுப்பதற்கு முன் ஒப்பந்தத்தில் உள்ள அறிவிப்பு காலத்தையும் பொருந்தும் உள்ளூர் சட்டத்தையும் பார்க்கவும்."),
                new FaqItem("consumer", "நுகர்வோர்", "குறைபாடுள்ள பொருளுக்கு பணத்திருப்பு கேட்கலாமா?", "பில் மற்றும் ஆதாரம் இருந்தால் பழுது, மாற்று, பணத்திருப்பு அல்லது இழப்பீடு கேட்கலாம்."),
                new FaqItem("women", "பெண்கள் பாதுகாப்பு", "அவசர துன்புறுத்தலில் என்ன செய்ய வேண்டும்?", "உடனடியாக 112 அல்லது 181 அழைத்து பாதுகாப்பான இடத்திற்கு செல்லுங்கள்.")
        );
    }

    public List<LawyerItem> lawyers() {
        return List.of(
                new LawyerItem("l1", "அருண் குமார்", "குற்றவியல் சட்டம்", "சென்னை", "+91 90000 10001", 4.8, true),
                new LawyerItem("l2", "மீனா ராஜ்", "குடும்ப சட்டம்", "மதுரை", "+91 90000 10002", 4.7, true),
                new LawyerItem("l3", "பிரகாஷ் வேல்", "நுகர்வோர் வழக்குகள்", "கோயம்புத்தூர்", "+91 90000 10003", 4.6, true),
                new LawyerItem("l4", "லதா சிவா", "சொத்து சட்டம்", "திருச்சி", "+91 90000 10004", 4.9, true)
        );
    }

    public List<EmergencyItem> emergency() {
        return List.of(
                new EmergencyItem("தேசிய அவசரம்", "112", "உடனடி ஆபத்து அல்லது காவல் உதவி"),
                new EmergencyItem("பெண்கள் உதவி எண்", "181", "பெண்கள் பாதுகாப்பு மற்றும் ஆதரவு"),
                new EmergencyItem("குழந்தை உதவி எண்", "1098", "குழந்தை பாதுகாப்பு"),
                new EmergencyItem("நுகர்வோர் உதவி எண்", "1915", "பொருள் மற்றும் சேவை புகார்கள்")
        );
    }

    public List<QueryHistory> history(String userId) {
        return historyRepository.findTop25ByUserIdOrderByCreatedAtDesc(userId);
    }
}
