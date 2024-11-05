document.addEventListener('DOMContentLoaded', () => {
    let currentQuestionIndex = 0;
    let selectedLanguage = null;
    let scores = {
        weaver: 0,
        pelican: 0,
        flycatcher: 0,
        owl: 0,
        crow: 0,
        crane: 0,
        parakeet: 0,
        eagle: 0,
        pigeon: 0,
    };
    const totalQuestions = 14;

    const englishQuestions = [
        { question: "You start your journey over the seashore. Dark clouds roll in fast. You...", choices: ["Imma start anyways - gotta get there before the other birds do", "Nah, no need to mess up my feathers. I’ll find a safe detour"], weights: [{ flycatcherScore: 1 }, { crowScore: 1 }] },
        { question: "As you reach the mangroves, your wings feel heavy with unease. You decide to...", choices: ["Press on. Nothing like a challenge to shake off the nerves", "Rest first. Everything else is less important than your wellbeing"], weights: [{ flycatcherScore: 1 }, { owlScore: 1 }] },
        { question: "You see a fellow bird trapped and calling for help. What's your move?", choices: ["I’m not leaving anyone behind - I’ll free the poor bird", "Hold up… is this a trap for me too?"], weights: [{ pelicanScore: 1 }, { craneScore: 1 }] },
        { question: "Flying further, you spot farmers catching pests in a rice paddy. You...", choices: ["Free snacks?? Imma help catch a grasshopper or two", "Observe if the farmers are friends or not before making any move"], weights: [{ pelicanScore: 1 }, { crowScore: 1 }] },
        { question: "Tired from the trip, you find a cozy wetland to rest and...", choices: ["Clear your mind to relax and enjoy the tranquility of the lush scenery", "Make sure you have the place all to yourself as you need some me-time"], weights: [{ pigeonScore: 1 }, { owlScore: 1 }] },
        { question: "You wake up from your short-lived nap to the cry of a vulnerable brood of hatchlings. You...", choices: ["Stay around to keep dangers away and make sure the hatchlings are fed", "They take a liking to you immediately (as expected since you're always counted on)"], weights: [{ eagleScore: 1 }, { craneScore: 1 }] },
        { question: "You feel a sense of danger approaching, probably some traffickers or predators. You decide to...", choices: ["Fight off the danger vigorously like a champ", "Poop on the intruders for fun (cuz ur a bird, duh)"], weights: [{ eagleScore: 1 }, { parakeetScore: 1 }] },
        { question: "The hatchlings are safe. Next on your journey, you pass a dried-up former marsh and...", choices: ["Let’s get a restoration plan going ASAP - this needs fixing!", "Wow, this is... depressing. I need to sit and reflect on it."], weights: [{ weaverScore: 1 }, { owlScore: 1 }] },
        { question: "Soon, the wind grows strong as you near a rocky hillside. Your call is to...", choices: ["Wind? Bring it on! Nothing can stop me!", "Maybe waiting it out is smarter—why fight nature?"], weights: [{ eagleScore: 1 }, { craneScore: 1 }] },
        { question: "In the distance, a waterfall appears. You then...", choices: ["Fly downstream to the river to admire your beauty in the water", "Fly around it for a more peaceful journey"], weights: [{ flycatcherScore: 1 }, { pigeonScore: 1 }] },
        { question: "The nearby riverbanks are bustling with life. Suddenly you see some wild animals quarrel. You...", choices: ["Twerk to divert the tension and start an impromptu dance-off", "Effortlessly stop the fight and make peace among them"], weights: [{ parakeetScore: 1 }, { pigeonScore: 1 }] },
        { question: "Up ahead is a polluted canal, you see volunteers cleaning up debris as you're flying over. You...", choices: ["Join in to help to the best of your possibility", "Watch from afar, curious about their approach"], weights: [{ pelicanScore: 1 }, { crowScore: 1 }] },
        { question: "Not long after your departure, a forest full of food appears. What do you do?", choices: ["Gather food and plan ahead - you’ll need it for later", "Enjoy the present - why worry so much about the future?"], weights: [{ weaverScore: 1 }, { parakeetScore: 1 }] },
        { question: "As the sun sets, you reflect on your journey. What now?", choices: ["Think about how to do better next time", "Feel proud of everything you've achieved so far"], weights: [{ weaverScore: 1 }, { flycatcherScore: 1 }] },
    ];

    const vietnameseQuestions = [
        { question: "Bạn chuẩn bị xuất phát từ bờ biển nhưng chợt thấy mây đen kéo. Bạn...", choices: ["Kệ - dân chơi không sợ mưa rơi", "Thôi khoải. Tìm đường khác an toàn hơn nè"], weights: [{ flycatcherScore: 1 }, { crowScore: 1 }] },
        { question: "Bay đến rừng ngập mặn thì thấy hơi mỏi nách (´〜｀*). Bạn quyết định...", choices: ["Cứ bay tiếp thôi. Càng thử thách càng vui", "Nghỉ ngơi tí đã. Sức khỏe mình mới là quan trọng nhất"], weights: [{ flycatcherScore: 1 }, { owlScore: 1 }] },
        { question: "Sau đó, bạn bắt gặp một con chim khác bị mắc kẹt và kêu cứu. Bạn nghĩ...", choices: ["Không thể bỏ rơi ai được - phải cứu bé chim đáng thương này", "Khoan đã… có khi nào là bẫy mình luôn không ta?"], weights: [{ pelicanScore: 1 }, { craneScore: 1 }] },
        { question: "Bay một đoạn nữa, bạn thấy các cô chú nông dân đang bắt sâu dưới ruộng lúa. Bạn nghĩ...", choices: ["Woaa thơm phức dí hà. Phải xuống bắt phụ mấy con sâu béo bở th", "Quan sát xem mấy bác nông dân có thiện chí hông đã"], weights: [{ pelicanScore: 1 }, { crowScore: 1 }] },
        { question: "Bắt đầu thấy mệt mỏi, bạn quyết định dừng chân tại một vùng đất ngập nước và...", choices: ["Thư giãn đầu óc và tận hưởng không khí xanh mướt", "Kiểm tra xem có ai gần đó không vì bạn cần một chill một mình"], weights: [{ pigeonScore: 1 }, { owlScore: 1 }] },
        { question: "Chợp mắt không bao lâu thì bạn bị tiếng khóc của mấy bé chim non yếu ớt đánh thức. Bạn...", choices: ["Bạn ở lại bảo vệ và kiếm ít mồi cho tụi nhỏ luôn cho chắc ăn", "Bỗng tụi nhỏ quấn bạn như người nhà (dễ hiểu thôi vì ai cũng tin tưởng bạn mà)"], weights: [{ eagleScore: 1 }, { craneScore: 1 }] },
        { question: "Bạn cảm nhận được nguy hiểm đang đến gần, có thể là thợ săn hoặc thú dữ. Bạn quyết định…", choices: ["Chiến đấu hết mình như một nhà vô địch", "Ỉa lên đầu kẻ xâm nhập cho vui"], weights: [{ eagleScore: 1 }, { parakeetScore: 1 }] },
        { question: "Đàn chim non đã an toàn. Tiếp đến, bạn bay qua một đầm lầy khô cạn và nghĩ...", choices: ["Ê không ổn, phải lên kế hoạch bảo tồn khu này liền", "Ủa trời, buồn ghê… Ngồi suy ngẫm tí đã"], weights: [{ weaverScore: 1 }, { owlScore: 1 }] },
        { question: "Bay một đoạn nữa thì trời nổi gió. Bạn nghĩ…", choices: ["Có tí gió sao cản được mình!", "Chờ tí gió sẽ lặng - chống lại thiên nhiên làm gì"], weights: [{ eagleScore: 1 }, { craneScore: 1 }] },
        { question: "Ở đằng xa, bạn nghe tiếng thác đổ rì rào. Bạn liền...", choices: ["Bay xuống chân thác để nhìn ngắm vẻ đẹp của mình trong làn nước", "Bay đường vòng tránh để con thác đổ"], weights: [{ flycatcherScore: 1 }, { pigeonScore: 1 }] },
        { question: "Bờ sông gần đó đang nhộn nhịp sự sống. Bỗng bạn thấy vài con thú hoang cãi nhau. Bạn…", choices: ["Nhảy dolce để xua tan bầu không khí căng thẳng", "Nhẹ nhàng giảng hòa đôi bên"], weights: [{ parakeetScore: 1 }, { pigeonScore: 1 }] },
        { question: "Phía trước là một con kênh ô nhiễm, bạn thấy tình nguyện viên đang dọn rác khi bay qua. Bạn…", choices: ["Nhảy vô phụ giúp hết sức có thể", "Đứng xa xa quan sát cách họ làm việc"], weights: [{ pelicanScore: 1 }, { crowScore: 1 }] },
        { question: "Sau đó, bạn rời đi và bay tiếp. Rồi lại xuất hiện một khu rừng với đầy thức ăn. Bạn quyết định...", choices: ["Tích trữ đồ ăn và lập kế hoạch ăn uống", "Enjoy cái moment này - lo xa chi cho mệt"], weights: [{ weaverScore: 1 }, { parakeetScore: 1 }] },
        { question: "Mặt trời bắt đầu lặn, bạn nhìn lại hành trình vừa qua và nghĩ...", choices: ["Nghĩ cách để lần sau làm tốt hơn nữa", "Tự hào về tất cả những gì mình đã đạt được"], weights: [{ weaverScore: 1 }, { flycatcherScore: 1 }] },
    ];

    function displayCurrentQuestion() {
        const questions = selectedLanguage === 'english' ? englishQuestions : vietnameseQuestions;
        const currentQuestion = questions[currentQuestionIndex];
        const questionElement = document.getElementById('question');
        const choicesContainer = document.getElementById('choices');
        const questionImage = document.getElementById('question-image');

        document.getElementById('q-current').textContent = `Q${currentQuestionIndex + 1}`;
        questionElement.textContent = currentQuestion.question;
        questionImage.src = `image_q${currentQuestionIndex + 1}.jpg`;

        choicesContainer.innerHTML = '';
        currentQuestion.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.classList.add('choices');
            button.addEventListener('click', () => handleChoiceClick(index, button, currentQuestion.weights[index]));
            choicesContainer.appendChild(button);
        });

        document.getElementById('done-button').style.display = 'block';
    }

    function handleChoiceClick(choiceIndex, button, weight) {
        document.querySelectorAll('.choices').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        
        // Increment the score for the selected personality
        for (const personality in weight) {
            scores[personality] += weight[personality];
        }
    }

    document.getElementById('done-button').addEventListener('click', () => {
        const questions = selectedLanguage === 'english' ? englishQuestions : vietnameseQuestions;
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            displayCurrentQuestion();
        } else {
            showNameEntry();
        }
    });

    function showNameEntry() {
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('name-entry').style.display = 'block';
    }

    document.getElementById('submit-name').addEventListener('click', () => {
        const testName = document.getElementById('test-taker-name').value.trim();
        if (testName) {
            displayResult(testName);
            trackQuizCompletion(testName);  // Track quiz completion
        } else {
            alert("Please enter your name to proceed.");
        }
    });

    function displayResult(testTakerName) {
        // Sort personalities by score
        const sortedPersonalities = Object.entries(scores).sort(([,a], [,b]) => b - a);
        const topPersonality = sortedPersonalities[0][0];  // Personality with the highest score
        const secondTopPersonality = sortedPersonalities[1][0]; // Personality with the second-highest score

        const personalityMatches = {
            weaver: ["parakeet", "owl"],
            pelican: ["owl", "eagle"],
            flycatcher: ["crane", "pigeon"],
            owl: ["weaver", "pelican"],
            crow: ["parakeet", "eagle"],
            crane: ["pigeon", "flycatcher"],
            parakeet: ["weaver", "crow"],
            eagle: ["crow", "pelican"],
            pigeon: ["crane", "flycatcher"]
        };

        const topResult = topPersonality;
        const birdMatch = personalityMatches[topResult].includes(secondTopPersonality)
            ? secondTopPersonality
            : personalityMatches[topResult][0];

        const personaImagePath = `${selectedLanguage === 'english' ? 'eng' : 'vie'}-persona-${topResult}.png`;
        const matchImagePath = `${selectedLanguage === 'english' ? 'eng' : 'vie'}-match-${birdMatch}.png`;

        overlayTextOnCanvas('persona-canvas', personaImagePath, `name: ${testTakerName}`);
        overlayTextOnCanvas('match-canvas', matchImagePath, `${testTakerName}'s match`);

        document.getElementById('question-container').style.display = 'none';
        document.getElementById('name-entry').style.display = 'none';
        document.getElementById('result-container').style.display = 'block';
    }

    function overlayTextOnCanvas(canvasId, imagePath, overlayText) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const image = new Image();

        image.src = imagePath;
        image.onload = function () {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            ctx.font = '30px Arial';
            ctx.fillStyle = 'black';

            // Position text overlay in the bottom-right
            const xPosition = canvas.width - 50;
            const yPosition = 355;
            ctx.textAlign = 'right';
            ctx.fillText(overlayText, xPosition, yPosition);

            // Set the download link with the canvas data URL after drawing
            const downloadLink = document.getElementById(`${canvasId}-download`);
            downloadLink.href = canvas.toDataURL('image/png');
        };
    }

    function trackQuizCompletion(name) {
        gtag('event', 'quiz_completion', {
            event_category: 'Quiz',
            event_label: 'Bird Persona Quiz Completion',
            value: 1,
            user_name: name
        });
    }

    document.querySelectorAll('.language-button').forEach(button => {
        button.addEventListener('click', (event) => {
            selectedLanguage = event.target.dataset.language;
            document.querySelectorAll('.language-button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            document.getElementById('next-button').style.display = 'block';
        });
    });

    document.getElementById('next-button').addEventListener('click', () => {
        if (selectedLanguage) {
            document.getElementById('language-selection').style.display = 'none';
            document.getElementById('question-container').style.display = 'block';
            currentQuestionIndex = 0;
            displayCurrentQuestion();
        }
    });
});
