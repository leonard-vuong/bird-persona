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
        { question: "You start your journey over the seashore...", choices: ["Imma start anyways...", "Nah, no need to mess up..."], weights: [{ flycatcher: 1 }, { crow: 1 }] },
        { question: "Not long after your departure, a forest full of food appears. What do you do?", choices: ["Gather food and plan ahead - you’ll need it for later", "Enjoy the present - why worry so much about the future?"], weights: [{ weaver: 1 }, { parakeet: 1 }] },
    ];

    const vietnameseQuestions = [
        { question: "Bạn chuẩn bị xuất phát từ bờ biển...", choices: ["Kệ - dân chơi không sợ...", "Thôi khoải. Tìm đường khác..."], weights: [{ flycatcher: 1 }, { crow: 1 }] },
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
            if (index === 0) button.classList.add('selected');
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
        } else {
            alert("Please enter your name to proceed.");
        }
    });

    function displayResult(testTakerName) {
        const sortedPersonalities = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
        const topPersonality = sortedPersonalities[0];
        const secondTopPersonality = sortedPersonalities[1];

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

        overlayTextOnCanvas('persona-canvas', personaImagePath, `name: ${testTakerName}`, 'persona-download');
        overlayTextOnCanvas('match-canvas', matchImagePath, `${testTakerName}'s match`, 'match-download');

        document.getElementById('question-container').style.display = 'none';
        document.getElementById('name-entry').style.display = 'none';
        document.getElementById('result-container').style.display = 'block';
    }

    function overlayTextOnCanvas(canvasId, imagePath, overlayText, downloadId) {
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
            const downloadLink = document.getElementById(downloadId);
            downloadLink.href = canvas.toDataURL('image/png');
            downloadLink.download = `${canvasId}.png`; // Set filename
        };
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
