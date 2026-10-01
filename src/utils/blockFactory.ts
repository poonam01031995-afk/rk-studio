import type { BlockType, ContentBlock } from '../types/document';

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  'hero-intro': 'Chapter Hero Banner',
  'heading': 'Topic Heading (H2/H3)',
  'paragraph': 'Body Text Paragraph',
  'box-lead': 'Lead Highlight Card (.lead)',
  'box-definition': 'Definition Box (.defbox)',
  'box-caution': 'Caution Checkpoint (Anti-Trap)',
  'box-life-example': 'Real-Life Analogy Box',
  'box-case-study': 'Case Study & Context',
  'box-exam-tip': "Teacher's Exam Tip",
  'box-formula': 'Formula & Scientific Law',
  'box-worked': 'Worked Numerical Steps',
  'box-summary': 'Summary & Quick Recap',
  'box-instructions': 'Examination Instructions',
  'bullet-list': 'Universal Rich Bullets',
  'card-grid-3': '3-Card Concept Grid',
  'comparison-vs': 'Versus Strip (A vs B)',
  'timeline-steps': 'Chronological Timeline',
  'data-table': 'Academic Data Table',
  'question-card': 'CBSE Question Card (PYQ)',
  'companion-grid': '2-Col Visual Companion',
  'image-block': 'Image / Diagram Block',
  'page-break': 'Page Break (नया पृष्ठ)',
  'box-activity': 'NCERT Activity / Lab Box',
  'hallmark-closing': 'Institutional Closing Card',
};

export const createDefaultBlock = (type: BlockType): ContentBlock => {
  const id = `block-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  switch (type) {
    case 'hero-intro':
      return {
        id,
        type: 'hero-intro',
        eyebrow: 'CBSE 2026-27 • NCERT REVISION ESSENTIALS',
        title: 'अध्याय का शीर्षक / Chapter Topic Title',
        subtitle: 'विस्तृत 2–3 पंक्तियों का शैक्षणिक सार संक्षेप जो अध्याय की संपूर्ण वैचारिक यात्रा, मुख्य आयामों और बोर्ड परीक्षा के मुख्य बिंदुओं को रेखांकित करता हो।',
        chips: ['📘 Full NCERT Coverage', '🎯 Board Marking Scheme', '💡 Real-Life Examples', '📝 PYQs (1/3/5 Marks)'],
      };

    case 'heading':
      return {
        id,
        type: 'heading',
        level: 2,
        text: '1. मुख्य विषय शीर्षक / Main Topic Heading',
        tag: 'TOPIC SECTION • NCERT ALIGNED',
      };

    case 'paragraph':
      return {
        id,
        type: 'paragraph',
        text: 'यहाँ विस्तृत व्याख्या लिखें। आवश्यक पारिभाषिक शब्दों को <b>bold</b> या <i>italic</i> में हाइलाइट करें। भाषा सहज और स्पष्ट होनी चाहिए।',
      };

    case 'box-lead':
      return {
        id,
        type: 'box-lead',
        badge: '📖 STUDY NOTE & PEDAGOGICAL GUIDANCE',
        text: 'Explanation वाला हिस्सा आम बोल-चाल की सहज भाषा में है ताकि concept तुरंत समझ आए। Exam में लिखने योग्य मानक परिभाषाएँ व Question Bank नीचे अलग बॉक्सेस में दिए गए हैं।',
      };

    case 'box-definition':
      return {
        id,
        type: 'box-definition',
        term: 'मुख्य अवधारणा का नाम (English Technical Term)',
        definition: 'बोर्ड परीक्षा में पूरे अंक प्राप्त करने हेतु 15-25 शब्दों में शुद्ध, प्रामाणिक NCERT मानक परिभाषा।',
        points: [
          '1. सरल अर्थ: अवधारणा का प्राथमिक अर्थ और व्यावहारिक स्वरूप।',
          '2. मुख्य कार्य व ढांचा: संस्था, नियम या व्यवस्था का वास्तविक संचालन।',
          '3. बोर्ड निष्कर्ष: CBSE मार्किंग स्कीम के अनुसार अंतिम निर्णायक वैचारिक निष्कर्ष।',
        ],
        memoryHook: 'Devanagari Hook: सहज उदाहरण या ट्रिक जिससे यह परिभाषा परीक्षा हॉल में तुरंत याद आ जाए!',
      };

    case 'box-caution':
      return {
        id,
        type: 'box-caution',
        title: '⚠️ महत्वपूर्ण सावधानी / Caution Checkpoint (Anti-Trap Warning)',
        content: 'विद्यार्थी अक्सर परीक्षा में इस अवधारणा को लेकर भ्रमित हो जाते हैं और अंक खो देते हैं:',
        misconception: 'सामान्य गलत धारणा: विद्यार्थी अक्सर लिखते हैं कि यह दोनों पूरी तरह एक ही हैं...',
        reality: 'प्रामाणिक NCERT तथ्य: वास्तविकता में दोनों में मूलभूत अंतर है जिसे समझना अनिवार्य है।',
        bulletPoints: [
          'कभी भी दोनों पारिभाषिक शब्दों को आपस में न बदलें।',
          'उत्तर के अंत में उपयुक्त SI मात्रक (Unit) या संवैधानिक संदर्भ अवश्य लिखें।',
        ],
      };

    case 'box-life-example':
      return {
        id,
        type: 'box-life-example',
        title: '💡 दैनिक जीवन से उदाहरण: Real-Life Intuition Analogy',
        content: 'दैनिक जीवन का एक परिचित उदाहरण (जैसे स्कूल का लंच ब्रेक, परिवार का बजट, क्रिकेट मैच या मोबाइल रिचार्ज) जिससे कठिन संकल्पना एकदम सरल और जीवंत हो जाए।',
        takeaway: 'Key Takeaway: सिद्धांत केवल किताबों में नहीं, हमारे दैनिक जीवन के हर फैसले में काम करता है।',
      };

    case 'box-case-study':
      return {
        id,
        type: 'box-case-study',
        title: '🏛️ CASE STUDY & HISTORICAL CONTEXT / ऐतिहासिक साक्ष्य',
        source: 'NCERT Case Study & Primary Historical Records',
        content: 'वास्तविक घटना, ऐतिहासिक साक्ष्य या संवैधानिक उदाहरण जो सैद्धांतिक नियम को सिद्ध करता है और जिसे बोर्ड परीक्षा के दीर्घ उत्तरीय प्रश्नों में प्रमाण के रूप में उद्धृत किया जा सकता है।',
        points: [
          'प्रमुख ऐतिहासिक संदर्भ और भौगोलिक पृष्ठभूमि।',
          'संवैधानिक या नीतिगत निर्णय का दूरगामी परिणाम।',
        ],
      };

    case 'box-exam-tip':
      return {
        id,
        type: 'box-exam-tip',
        title: "TEACHER'S EXAM TIP & SCORING STRATEGY",
        marksTag: 'CBSE 3–5 Marks',
        tip: 'बोर्ड उत्तर लिखते समय मुख्य तकनीकी कीवर्ड्स को अवश्य अंडरलाइन करें और यदि संभव हो तो 2-3 बिंदुओं का फ्लोचार्ट बनाएं। परीक्षक मार्किंग स्कीम के अनुसार कीवर्ड्स खोजते हैं।',
        scoringRule: 'मार्किंग स्कीम: सही परिभाषा = 1 अंक, 2 मुख्य बिंदु = 2 अंक, उपयुक्त उदाहरण = 1 अंक।',
      };

    case 'box-formula':
      return {
        id,
        type: 'box-formula',
        formulaName: 'वैज्ञानिक सूत्र व नियम / Scientific Formula & Law',
        formulaExpr: 'V = I × R',
        description: 'ओम के नियमानुसार: स्थिर ताप पर चालक के सिरों का विभवांतर उसमें प्रवाहित धारा के समानुपाती होता है।',
        variables: [
          { symbol: 'V', meaning: 'विभवांतर (Potential Difference)', unit: 'Volt (V)' },
          { symbol: 'I', meaning: 'विद्युत धारा (Electric Current)', unit: 'Ampere (A)' },
          { symbol: 'R', meaning: 'प्रतिरोध (Resistance)', unit: 'Ohm (Ω)' },
        ],
      };

    case 'box-worked':
      return {
        id,
        type: 'box-worked',
        title: 'STEP-BY-STEP WORKED NUMERICAL / हल किया गया उदाहरण',
        problem: 'यदि किसी परिपथ में 12V की बैटरी से 4Ω का प्रतिरोधक जुड़ा हो, तो परिपथ में प्रवाहित धारा की गणना कीजिए।',
        steps: [
          'Step 1: दिए गए मान लिखें — विभवांतर (V) = 12V, प्रतिरोध (R) = 4Ω',
          'Step 2: सूत्र का उल्लेख करें — I = V / R',
          'Step 3: मान रखकर सरल करें — I = 12 / 4 = 3',
        ],
        finalAnswer: 'विद्युत धारा (I) = 3 Ampere (A)',
      };

    case 'box-activity':
      return {
        id,
        type: 'box-activity',
        activityNum: 'NCERT Activity 12.1',
        title: 'विद्युत धारा और विभवांतर के संबंध का प्रायोगिक सत्यापन',
        objective: 'परिपथ में वोल्टमीटर और एमीटर की सहायता से ओम के नियम का सत्यापन करना।',
        materials: 'नाइक्रोम का तार (0.5m), एमीटर (0-5A), वोल्टमीटर (0-3V), 4 शुष्क सेल (1.5V प्रत्येक), प्लग कुंजी।',
        procedure: [
          '1. परिपथ में पहले केवल एक सेल जोड़ें और एमीटर (I) तथा वोल्टमीटर (V) का पाठ्यांक नोट करें।',
          '2. फिर क्रम से दो, तीन और चार सेल जोड़कर प्रत्येक स्थिति में पाठ्यांक सारणीबद्ध करें।',
          '3. प्रत्येक स्थिति में अनुपात V/I का मान परिकलित करें।',
        ],
        observation: 'प्रत्येक बार V/I का अनुपात लगभग एक समान (स्थिरांक) प्राप्त होता है, जिससे सिद्ध होता है कि V ∝ I।',
      };

    case 'box-summary':
      return {
        id,
        type: 'box-summary',
        title: 'अध्याय का सार संक्षेप / KEY RECAP TAKEAWAYS',
        points: [
          'अध्याय का पहला केंद्रीय सिद्धांत और उसकी मूलभूत आवश्यकता।',
          'द्वितीय खंड में विश्लेषित मुख्य नियम और उसका प्रभाव।',
          'परीक्षा पूर्व त्वरित दोहराव हेतु आवश्यक सूत्र और तिथियां।',
        ],
      };

    case 'box-instructions':
      return {
        id,
        type: 'box-instructions',
        title: '📝 General Instructions / सामान्य निर्देश:',
        instructions: [
          'All questions are compulsory. (सभी प्रश्न अनिवार्य हैं।)',
          'Section A contains 20 Multiple Choice Questions (MCQs) of 1 mark each.',
          'Section B contains 5 Short Answer Questions of 2 marks each.',
          'Section C contains 6 Short Answer Questions of 3 marks each.',
          'Section D contains 4 Long Answer Questions of 5 marks each.',
          'Section E contains 3 Case-Based integrated units of assessment (4 marks each).',
        ],
      };

    case 'bullet-list':
      return {
        id,
        type: 'bullet-list',
        title: 'मुख्य विशेषताएं व बिंदु / Key Characteristics:',
        style: 'check',
        items: [
          { id: '1', text: 'प्रथम महत्वपूर्ण बिंदु — अवधारणा का स्पष्ट और ठोस तर्क।' },
          { id: '2', text: 'द्वितीय बिंदु — उदाहरण व तुलनात्मक साक्ष्य के साथ।' },
          { id: '3', text: 'तृतीय बिंदु — बोर्ड परीक्षा में लिखने योग्य निर्णायक तथ्य।' },
        ],
      };

    case 'card-grid-3':
      return {
        id,
        type: 'card-grid-3',
        cards: [
          {
            id: 'c1',
            title: '1. व्यवस्था प्रथम (Model Alpha)',
            points: ['प्रमुख कार्यप्रणाली', 'बाजार शक्तियों की भूमिका', 'मुख्य लाभ'],
            note: 'निजी पहल पर आधारित',
            colorVariant: 'blue',
          },
          {
            id: 'c2',
            title: '2. व्यवस्था द्वितीय (Model Beta)',
            points: ['सरकारी नियंत्रण व नियमन', 'सामाजिक कल्याण सर्वोपरि', 'केंद्रीय योजना'],
            note: 'राज्य द्वारा संचालित',
            colorVariant: 'navy',
          },
          {
            id: 'c3',
            title: '3. मिश्रित व्यवस्था (Model Gamma)',
            points: ['सह-अस्तित्व व संतुलन', 'सार्वजनिक व निजी भागीदारी', 'विकासशील देशों की पसंद'],
            note: 'भारत द्वारा अपनाया गया मॉडल',
            colorVariant: 'green',
          },
        ],
      };

    case 'comparison-vs':
      return {
        id,
        type: 'comparison-vs',
        leftTitle: 'संकल्पना A (विशेषताएं व गुण)',
        leftPoints: [
          'प्राकृतिक बाजार शक्तियों पर आधारित',
          'तीव्र तकनीकी नवाचार और प्रतिस्पर्धा',
          'लाभ अर्जन प्राथमिक प्रेरक शक्ति',
        ],
        rightTitle: 'संकल्पना B (तुलनात्मक विशेषताएं)',
        rightPoints: [
          'केंद्रीय प्राधिकरण द्वारा सुनियोजित नियंत्रण',
          'सामाजिक न्याय व समानता पर विशेष बल',
          'बुनियादी आवश्यकताओं की सार्वभौमिक उपलब्धता',
        ],
      };

    case 'timeline-steps':
      return {
        id,
        type: 'timeline-steps',
        items: [
          { id: 't1', period: 'Phase I', title: 'आरंभिक चरण', desc: 'अवधारणा की उत्पत्ति और प्राथमिक खोज।', color: '#0f3457' },
          { id: 't2', period: 'Phase II', title: 'विस्तार व विकास', desc: 'विभिन्न क्षेत्रों में प्रसार और प्रारंभिक सुधार।', color: '#1a5c9c' },
          { id: 't3', period: 'Phase III', title: 'संस्थागत सुदृढ़ीकरण', desc: 'नियमों का मानकीकरण और संवैधानिक प्रावधान।', color: '#127048' },
          { id: 't4', period: 'Phase IV', title: 'समकालीन स्वरूप', desc: 'वर्तमान 2026-27 के संदर्भ में प्रासंगिकता।', color: '#9a6a05' },
        ],
      };

    case 'data-table':
      return {
        id,
        type: 'data-table',
        caption: 'तुलनात्मक अध्ययन सारणी / Comparative Matrix',
        headers: ['तुलना का आधार', 'संकल्पना A', 'संकल्पना B', 'बोर्ड टिप्पणी (1 Mark)'],
        rows: [
          ['परिभाषा व अर्थ', 'प्राकृतिक शक्तियों का परिणाम', 'मानव निर्मित संस्थागत नियम', 'सीधा 1-अंक प्रश्न'],
          ['नियंत्रणकर्ता', 'स्वतंत्र बाजार तंत्र', 'संसद / संवैधानिक निकाय', 'PYQs में बार-बार पूछा गया'],
          ['अंतिम उद्देश्य', 'लाभ व कुशलता वृद्धि', 'समानता व जन-कल्याण', 'दीर्घ उत्तरीय उत्तर में लिखें'],
        ],
        note: 'स्रोत: NCERT प्रामाणिक पाठ्यपुस्तक व CBSE मार्किंग स्कीम।',
      };

    case 'question-card':
      return {
        id,
        type: 'question-card',
        qno: 'Q1',
        marks: '[CBSE 2024 - 1 Mark]',
        hot: true,
        questionType: 'mcq',
        question: 'Which of the following constitutional provisions guarantees fundamental rights protection?',
        questionHindi: 'निम्नलिखित में से कौन सा संवैधानिक प्रावधान मूल अधिकारों के संरक्षण की गारंटी देता है?',
        options: [
          'अनुच्छेद 14 (Article 14 - Right to Equality)',
          'अनुच्छेद 32 (Article 32 - Right to Constitutional Remedies)',
          'अनुच्छेद 44 (Article 44 - Uniform Civil Code)',
          'अनुच्छेद 51A (Article 51A - Fundamental Duties)',
        ],
        answer: 'अनुच्छेद 32 (Article 32 - Right to Constitutional Remedies)',
        explanation: 'डॉ. बी.आर. अंबेडकर ने अनुच्छेद 32 को "संविधान का हृदय और आत्मा" कहा था क्योंकि यह नागरिकों को अधिकारों के उल्लंघन पर सीधे सुप्रीम कोर्ट जाने का अधिकार देता है।',
        showSolution: true,
      };

    case 'companion-grid':
      return {
        id,
        type: 'companion-grid',
        imageSrc: '/rk-assets/rk-logo.png',
        imageCaption: 'चित्र 1: आर.के. लक्ष्मण ऐतिहासिक संपादकीय कार्टून व संवैधानिक मॉडल',
        title: 'संपादकीय कार्टून व आरेख विश्लेषण (Visual Interpretation)',
        narrative: 'यह आरेख यह दर्शाता है कि कैसे नीतिगत निर्णयों का सीधा असर आम नागरिक के जीवन पर पड़ता है। परीक्षा में अक्सर इस प्रकार के कार्टून आधारित प्रश्न पूछे जाते हैं।',
        points: [
          'कार्टून में दर्शाया गया मुख्य राजनीतिक संदेश क्या है?',
          'संवैधानिक प्रावधानों के संदर्भ में इस व्यंग्य की प्रासंगिकता समझाइए।',
        ],
      };

    case 'image-block':
      return {
        id,
        type: 'image-block',
        url: '/rk-assets/rk-logo.png',
        caption: 'चित्र 1.1: आधिकारिक संस्थागत आरेख व संरचनात्मक मॉडल।',
        alt: 'Academic Illustration',
      };

    case 'page-break':
      return {
        id,
        type: 'page-break',
        label: 'नया पृष्ठ / Page Break',
      };

    case 'hallmark-closing':
      return {
        id,
        type: 'hallmark-closing',
        instituteName: 'RK INSTITUTE OF LEARNING',
        tagline: 'गुणवत्तापूर्ण शिक्षा और संकल्प से सिद्धि',
        helpline: '📞 7903952008',
        address: 'स्वरूप नगर, कुशाल रोड, दिल्ली-110042',
        session: 'CBSE सत्र 2026-27 • सर्वाधिकार सुरक्षित',
        note: 'यह अध्ययन सामग्री केवल आर.के. इंस्टीट्यूट के पंजीकृत विद्यार्थियों के आंतरिक पठन-पाठन हेतु है।',
      };

    default:
      return {
        id,
        type: 'paragraph',
        text: 'नया ब्लॉक',
      };
  }
};
