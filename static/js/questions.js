let currentQuestionIndex = 0;
const userAnswers = {};
let totalScore = 0;

const questions = [
    {
        id: 1,
        text: "نمط النص: يشير إلى الطريقة أو الأسلوب الذي يكتب بها النص وأسلوب عرض المحتوى، مثل النمط الحواري، والنمط السردي",
        options: [
            "يقبل جميع أنماط النصوص",
            "يقبل جميع أنماط النصوص ويرد النمط الحجاجي فيه غالبا",
            "يجمع بين النمط السردي والوصفي والتفسيري، ويرد فيه النمط الحجاجي عادة",
            "يكون من النمط السردي والوصفي، ويرد فيه النمط التفسيري عادة",
            "كون غالبا من النمط الحواري والسردي، ويتناسب معه النمط الوصفي والنمط الإخباري",
            "يكون النص في الغالب الأعم من النمط الحواري ويتناسب معه النمط السردي"
        ]
    },
    {
        id: 2,
        text: "شكل النص: يشير إلى الشكل الفني الذي ورد فيه النص",
        options: [
            "جميع أشكال النصوص: بحث أكاديمي، نص أدبي، دراسة نقدية، مقالة فلسفية، حوارات صحفية.. إلخ",
            "معظم أشكال النصوص: مقالات أكاديمية، نصوص أدبية، نقدية، تاريخية، فلسفية، اجتماعية، شعر، خطب",
            "المقالات، الحوارات، المراسلات، التقارير، الشعر، الرحلات، السيرة الذاتية، الروايات",
            "المقالات، الحوارات، المراسلات، التقارير، المقطوعات الشعرية، شعر التفعيلة، المسرحيات",
            "الأخبار الصحفية، الحوارات، المراسلات، البطاقات، الاستمارات، مقطوعات الأناشيد القصيرة",
            "الحوارات القصيرة، المراسلات، البطاقات، مقطوعات الأناشيد القصيرة جدا"
        ]
    },
    {
        id: 3,
        text: "مضمون النص :يشير إلى محتوى النص والأفكار المتضمنة فيه",
        options: [
            "تطرق لأي من الموضوعات مثل: العلوم الإنسانية والعلوم البحثة، والموضوعات الأكاديمية، والمهنية. \n-       القصائد الطوال والأشعار في مختلف العصور.",
            "\n-      يتطرق للموضوعات المختلفة المرتبطة بمجال تخصصه.\n -       المقالات الأكاديمية، والثقافية، الصحفية.\n-       الموضوعات المتداولة في العلوم البحتة.\n-       القصائد والأشعار المشهورة في التراث العربي.\n",
            "\n-    يعبر عن المواقف والمشاعر ووجهات النظر.-\n       يتناول الموضوعات المتخصصة.\n-       يعرض لمشكلات معاصرة.\n-       الروايات الأدبية، والسيرة الذاتية.\n-       الخطب الدينية والسياسية.. إلخ.\n-       الموضوعات الشائعة في العلوم الطبيعية.\n-       الأشعار والقصائد الخالية من الألفاظ. الغامضة، والتراكيب المعقدة.",
            "\n-    يعبر عن المواقف والآراء، والميول والرغبات. \n-       يتناول قضايا في المجال العام أو مجال التخصص. \n-       يسرد القصص والروايات القصيرة. \n-       أشعار معاصرة، وقصائد تتسم بوحدة الفكرة والموضوع.",
            "\n-    يعبر عن أحداث وخبرات حقيقية، وموضوعات مألوفة. \n-       يتناول قضايا أساسية وعامة تركز على موضوع واحد، مثل التعليم، السياحة. \n-       يقدم تعليمات، وإرشادات واضحة. \n-       يسرد الأخبار، والحكايات، والقصص، والنوادر. \n-    الأناشيد والأغاني",
            "\n-     يعبر عن أحداث وخبرات حقيقية، وموضوعات مألوفة، مثل الحياة اليومية، والأسرة، والعمل.  \n-        يقدم تعليمات سهلة، وإرشادات قصيرة. \n-        يسرد الحكايات، والنوادر. \n-        عبارة عن مقطوعة من الأناشيد أو الأغاني."
        ]
    }
    ,
    {
        id: 4,
        text: "أصالة النص : يشير إلى النصوص المختارة مما أنتجه أبناء اللغة العربية بشكل طبيعي دون تحوير أو تعديل، وهو خلاف النص المصطنع الذي أعد خصيصا ليناسب احتياجات الطلاب ومستوياتهم",
        options: [
            "أصيل",
            "أصيل، أو أصيل مبسط",
            "أصيل، أو أصيل أعيدت صياغته",
            "النص مكتوب خصيصا (مصطنع) أو أصيل معدل الصياغة.",
        ]
    }
    ,
    {
        id: 5,
        text: "أسلوب التعبير :يشير إلى مجموعة الأدوات والأساليب اللغوية والأدبية التي يستخدمها الكاتب لنقل الأفكار والمشاعر والمعلومات",
        options: [
            "أسلوب أدبي يتضمن التعبير الرمزي والإيحائي الأسلوب الأكاديمي للأبحاث والدراسات الأسلوب العلمي للأبحاث الطبيعية والتجريبية الأسلوب الحجاجي في الدراسات الفلسفية والنقدية",
            "\n-       الأسلوب أدبي يحتوي على أساليب بلاغية ومجازية رفيعة.\n-       الأسلوب الأكاديمي للأبحاث والدراسات.\n-       الأسلوب العلمي الواضح (غير موغل في التخصص) بالنسبة للعلوم الطبيعية.",
            "الأسلوب أدبي يحتوي على أساليب بلاغية ومجازية لا سيما الشائع والمتداولة الأسلوب العلمي المبسط (في العلوم الطبيعية)",
            "التعبير واضح، ويشمل التعابير المجازية المفهومة التي تخلو من الغموض، مثل: التشبيه، والاستعارة",
            "التعبير صريح ومباشر، وتقتصر التعابير المجازية على الشائعة والمتداولة مثل: اِحمّر وجهه خجلا",
            "يستخدم التعبير الصريح والمباشر، ويخلو من التعابير المجازية إلا في عبارات محدودة مثل التعابير المسكوكة والمتداولة، مثل: أهلا وسهلا، بالرفاء والبنين، زارتنا البركة"
        ]
    }
    ,
    {
        id: 6,
        text: "نمط الجملة  :يشير إلى طريقة  صياغة وترتيب عناصرها وكيفية ربط مكوناتها",
        options: [
            "يحتوي على أنماط من الجمل المتداخلة، والمتشابكة",
            "يحتوي النص على أنماط من الجمل المتداخلة",
            "يصاغ النص من الجمل المركبة",
            "يصاغ من الجمل المزدوجة والمركبة شريطة أن يخلو تركيب الجملة من التعقيد، كما يجوز التقديم والتأخير بشرط ألا يحدث لبسًا",
            "يصاغ النص من الجمل البسيطة والممتدة",
            "يصاغ النص من الجمل البسيطة، مع مراعاة الترتيب النحوي، فلا يقدم المفعول به عن الفاعل مثلا"
        ]
    }
    ,
    {
        id: 7,
        text: "طول الجملة : يشير إلى عدد المفردات في الجملة",
        options: [
            "قد يتجاوز طول الجملة 27 مفردة",
            "يتجاوز طول الجملة 25 مفردة",
            "قد يصل طول الجملة إلى 25 مفردة",
            "طول الجملة في الغالب متوسط وقد يطول أحيانا إلى 14 مفردة لاشتمالها على أدوات الربط أو الأسماء الموصولة",
            "الجمل قصيرة لا تزيد عن 8 مفردات",
            "الجمل قصيرة لا تزيد عن 5 كلمات"
        ]
    }
    ,
    {
        id: 8,
        text: "حجم المفردات  : يشير إلى عدد المفردات الأساسية في النص",
        options: [
            "المفردات في الصفحة 250 – 350",
            "المفردات في الصفحة 200 - 250",
            "المفردات الأساسية في النص ما بين 150 – 200",
            "المفردات الأساسية في النص ما بين 100 – 150",
            "المفردات الأساسية في النص 60 - 70 مفردة",
            "المفردات الأساسية في النص 50 مفردة تقريبا"
        ]
    }
    ,
    {
        id: 9,
        text: "نوعية المفردات :يشير إلى خصائص المفردة نحو سماتها الدلالية وانتشارها وذيوعها",
        options: [
            "مجردة ومتعددة الدلالة، ومفردات ومصطلحات خاصة",
            "مفردات مجردة، مفردات تحمل دلالات متعددة، ومصطلحات التخصص",
            "المفردات المجردة والمصطلحات المتعلقة بالتخصص",
            "تكثُر المفردات المجردة التي يمكن فهم معناها من السياق",
            "تكون المفردات في الغالب الأعم محسوسة، والمفردات المجردة تكون شائعة ومتداولة",
            "مفردات محسوسة ومادية، وشائعة ومتداولة"
        ]
    }
    ,
    {
        id: 10,
        text: "تدوير المفردات والتراكيب :يشير إلى التكرار  للمفردة ومشتقاتها في النص، وكذلك مدى تكرار التراكيب والأساليب ",
        options: [
            "\n- لا يشترط تدوير المفردات والتراكيب \n-       تتنوع المفردات ومرادفاتها، كما تتنوع التراكيب والأساليب>",
            "يتكرر المرادف، ولا تتكرر المفردة بعينها. ويعبر عن الفكرة بأساليب وتراكيب متنوعة",
            "تتكرر بعض المفردات الصعبة، أو مرادفاتها، وقد تتكرر بعض التراكيب اللغوية والأساليب البلاغية",
            "تتكرر الأساليب النحوية والبلاغية وتتكرر بعض المرادفات، مع تدوير المفردات الجديدة ومشتقاتها",
            "تتكرر بعض التراكيب والمفردات مع تدوير مشتقاتها في النص",
            "تتكرر التراكيب والمفردات ويعاد تدوير مشتقاتها في النص"
        ]
    }
    ,
    {
        id: 11,
        text: "الضبط والتشكيل   :يشير إلى وضع الحركات على المفردات",
        options: [
            "يخلو من الضبط ما عدا النصوص الدينية",
            "يخلو من التشكيل والضبط ما عدا المفردات أو العبارات المُلبسة أو النصوص الدينية",
            "معظم النص مضبوط بالشكل لا سيما أواخر الكلمات",
            "يضبط معظم المفردات في النص، ويفضل ألا يكون تشكيل الكلمات تاما بحيث يترك الحرف الذي يسبق المد مثلا، وتخلو الحروف والأدوات والمفردات الشائعة من الضبط",
            "يفضل ضبط جميع مفردات النص بالشكل ضبطا تاما",
            "ضبط جميع المفردات بالشكل ضبطا تاما"
        ]
    }
    ,
    {
        id: 12,
        text: "تنسيق الفقرة : يشير إلى استيفاء النص لعلامات الترقيم وضبط الفقرات وتتسيقها",
        options: [
            "فضل ألا تزيد الفقرة عن 10 أسطر، وتترك مسافة تباعد كافية بين الأسطر والفقرات.",
            "يفضل ألا تزيد الفقرة عن سبعة أسطر، وتترك مسافة تباعد كافية بين الأسطر والفقرات.",
            "ُستخدم علامات الترقيم المناسبة. تباعد الأسطر مفرد أو بمعدل 1,5. الفقرة لا تزيد عن سبعة أسطر، وتترك مسافة تباعد كافية بين الفقرات",
            "تُستخدم علامات الترقيم المناسبة. تباعد الأسطر بمعدل 1,5 أو مزدوج. الفقرة لا تزيد عن خمسة أسطر، وتترك مسافة تباعد كافية بين الفقرات.",
            "\n- تُستخدم علامات الترقيم بشكل تام. \n- تباعد الأسطر مزدوج، بحيث تشكيل الكلمات لا يتداخل بين السطور. \n- الفقرة لا تزيد عن 5 جمل، وتترك مسافة تباعد كافية بين الفقرات.",
            "تُستخدم علامات الترقيم بشكل تام. تباعد الأسطر مزدوج، بحيث تشكيل الكلمات لا يتداخل بين السطور. الفقرة لا تزيد عن 3 جمل، وتترك مسافة تباعد كافية بين الفقرات."
        ]
    }
    ,
    {
        id: 13,
        text: "نوع الخط : يشير إلى شكل كتابة الأحرف والكلمات ",
        options: [
            "كافة أنواع الخطوط المختلفة",
            "جميع أنواع الخطوط",
            "النص مكتوب بأحد الخطوط الرقمية المتداولة",
            "النص مكتوب بخط رقمي مقروء، ويفضل أن يكون من خطوط النسخ أو المقاربة لها",
            "النص مكتوب بخط رقمي واضح ويفضل أن يكون خط نسخ",
            "النص مكتوب بخط نسخ مرقوم على الحاسوب"
        ]
    }
    ,
    {
        id: 14,
        text: "حجم الخط : يشير إلى مقاس بنط الخط على برامج تحرير النصوص مثل MS Office",
        options: [
            "حجم الخط لا يقل عن بنط 12 ويفضل أن يكون 14.",
            "حجم الخط يفضل ألا يقل عن 14",
            "حجم الخط يفضل أن يكون 16",
            "حجم الخط لا يقل عن بنط 18"
        ]
    }
    ,
    {
        id: 15,
        text: "الوسائل المعينة : يشير إلى مرفقات النص من أدوات ووسائل غير لغوية كالصور والرسومات والجداول",
        options: [
            "قد يحتوي النص على شرح بعض المفردات أو المصطلحات. - قد يحتوي على الرسوم البيانية، والجداول إذا ارتبطت بمضمون النص.",
            "يحتوي النص على شرح للمفردات الصعبة والمصطلحات الخاصة. قد يحتوي على الرسوم البيانية، والجداول إذا ارتبطت بمضمون النص",
            "يحتوي النص على بعض الصور أو الرسوم التوضيحية التي ترتبط بمضمون النص",
            "يحتوي النص على بعض الصور أو الرسوم التوضيحية التي قد تسهم في فهم النص أو تكسر رتابته",
            "يحتوي النص – غالبا – على الصور أو الرسوم التوضيحية التي تيسر فهم النص",
            "يحتوي النص على الصور أو الرسوم التوضيحية التي تساعد على فهم النص"
        ]
    }
];

document.addEventListener('DOMContentLoaded', function() {
    loadPDF();
    loadQuestion(0);
    updateNavigation();
    
    document.getElementById('prev-btn')?.addEventListener('click', showPreviousQuestion);
    document.getElementById('next-btn')?.addEventListener('click', showNextQuestion);
    
    const shareForm = document.getElementById('share-form');
    if (shareForm) {
        shareForm.addEventListener('submit', function(e) {
            e.preventDefault();
            shareResults(e);
        });
    }
    
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            resetQuiz();
        });
    }
});

async function loadPDF() {
    const viewer = document.getElementById('pdf-viewer');
    if (!viewer) return;
    
    try {
        const response = await fetch('/get_pdf_path');
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error);
        }

        if (data.file_type === 'pdf') {
            viewer.style.display = 'block';
            viewer.src = data.file_path;
        } else if (data.file_type === 'txt') {
       
            const textContainer = document.createElement('div');
            textContainer.className = 'text-container p-3';
            textContainer.style.height = '600px';
            textContainer.style.overflowY = 'auto';
            textContainer.style.border = '1px solid #ddd';
            textContainer.style.backgroundColor = '#fff';
            
            const response = await fetch(data.file_path);
            const text = await response.text();
            textContainer.textContent = text;
            
            viewer.parentElement.replaceChild(textContainer, viewer);
        } else if (data.file_type === 'jpg' || data.file_type === 'jpeg') {
      
            const img = document.createElement('img');
            img.className = 'img-fluid';
            img.style.maxHeight = '600px';
            img.style.width = 'auto';
            img.src = data.file_path;
            
            viewer.parentElement.replaceChild(img, viewer);
        }
    } catch (error) {
        console.error('Error loading file:', error);
        if (viewer.parentElement) {
            viewer.parentElement.innerHTML = '<div class="alert alert-danger">حدث خطأ أثناء تحميل الملف</div>';
        }
    }
}

function selectAnswer(questionIndex, answerIndex) {
    const previousAnswer = userAnswers[questionIndex];
    if (previousAnswer !== undefined) {
        totalScore -= (previousAnswer + 1);
    }
    
    userAnswers[questionIndex] = answerIndex;
    totalScore += (answerIndex + 1);
    
    const options = document.querySelectorAll('.answer-option');
    options.forEach(option => {
        const value = parseInt(option.dataset.value);
        option.classList.remove('selected');
        if (value === answerIndex) {
            option.classList.add('selected');
        }
    });
    
    if (questionIndex === questions.length - 1) {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.textContent = 'إنهاء';
            nextBtn.onclick = submitAnswers;
        }
    }
}

function submitAnswers() {
    const answeredQuestions = Object.keys(userAnswers).length;
    if (answeredQuestions < questions.length) {
        alert('الرجاء الإجابة على جميع الأسئلة قبل الإنهاء');
        return;
    }

    const data = {
        score: calculateLevel(totalScore).score,
        level: calculateLevel(totalScore).level
    };

    fetch('/submit_answers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Server Response:', data);

            showResults(data.score, data.difficulty_level);
        } else {
            throw new Error(data.error || 'حدث خطأ أثناء معالجة النتائج');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('حدث خطأ أثناء حساب النتيجة: ' + error.message);
    });
}

function calculateLevel(score) {
    let level = "";
    if (score < 0) {
        level = "Invalid Score";
    } else if (score < 17) {
        level = "C2";
    } else if (score < 26) {
        level = "C2 & C1";
    } else if (score < 31) {
        level = "C1";
    } else if (score < 40) {
        level = "C1 & B2";
    } else if (score < 45) {
        level = "B2";
    } else if (score < 54) {
        level = "B2 & B1";
    } else if (score < 59) {
        level = "B1";
    } else if (score < 69) {
        level = "B1 & A2";
    } else if (score < 74) {
        level = "A2";
    } else if (score < 83) {
        level = "A2 & A1";
    } else {
        level = "A1+++";
    }

    return { score, level };
}


function showResults(score, difficulty) {
    const questionsSection = document.getElementById('questions-section');
    const resultsSection = document.getElementById('results-section');
    
    if (questionsSection && resultsSection) {
        questionsSection.style.display = 'none';
        resultsSection.style.display = 'block';
        
        const difficultyElement = document.getElementById('difficulty-level');
        const scoreElement = document.getElementById('total-score');
        
        if (difficultyElement) difficultyElement.textContent = difficulty;
        if (scoreElement) scoreElement.textContent = score;
    }
}

function resetQuiz() {
    currentQuestionIndex = 0;
    Object.keys(userAnswers).forEach(key => delete userAnswers[key]);
    totalScore = 0;
    
    const questionsSection = document.getElementById('questions-section');
    const resultsSection = document.getElementById('results-section');
    
    if (questionsSection && resultsSection) {
        resultsSection.style.display = 'none';
        questionsSection.style.display = 'block';
    }
    
    loadQuestion(0);
    updateNavigation();
}

function formatOptionText(text) {
    if (!text) return '';
    
    
    if (text.includes('\n-')) {
        const lines = text.split('\n');
        const mainText = lines[0];
        const bulletPoints = lines.slice(1).filter(line => line.trim());
        
        if (bulletPoints.length > 0) {
            return `
                ${mainText}
                <ul>
                    ${bulletPoints.map(point => `<li>${point.replace('-', '').trim()}</li>`).join('')}
                </ul>
            `;
        }
    }
    

    return text;
}

function loadQuestion(index) {
    currentQuestionIndex = index;
    const question = questions[index];
    const container = document.getElementById('questions-container');
    
    if (container && question) {
        container.innerHTML = `
            <div class="question-item">
                <h3 class="mb-4">${question.text}</h3>
                <div class="options-container">
                    ${question.options
                        .filter(option => option)
                        .map((option, i) => `
                            <div class="answer-option ${userAnswers[index] === i ? 'selected' : ''}" 
                                 onclick="selectAnswer(${index}, ${i})"
                                 data-value="${i}">
                                ${formatOptionText(option)}
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
        
        updateNavigation();
    }
}

function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
    }
}

function showNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }
}

function updateNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const counter = document.getElementById('question-counter');
    
    if (prevBtn && nextBtn && counter) {
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'إنهاء' : 'التالي';
        counter.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
    }
}

async function shareResults(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    console.log('Sending data:', {
        score: calculateLevel(totalScore).score,
        email: email,
        level: calculateLevel(totalScore).level
    });

    try {
        const response = await fetch('/share_results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                score: calculateLevel(totalScore).score,
                email: email,
                level: calculateLevel(totalScore).level
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('Server Response:', data);

            showResults(data.score, data.difficulty_level);
            updateResultsContent(data.success_message);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error sharing results:', error.message);
    }
}

function updateResultsContent(successMessage) {
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML = `<div class='success-message'>${successMessage}</div>`;
    resultsContent.innerHTML += `<button onclick='retry()'>إعادة المحاولة</button>`;
    resultsContent.innerHTML += `<button onclick='startNewEvaluation()'>بدء تقييم جديد</button>`;
}

function retry() {
}

function startNewEvaluation() {
}
