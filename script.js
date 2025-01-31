(() => {
    if (
        !("speechSynthesis" in window && "SpeechSynthesisUtterance" in window)
    ) {
        document.body.innerHTML =
            "The Speech Synthesis API is not supported in your browser";
    } else {
        const synth = window.speechSynthesis;
        const paragraphs = document.querySelectorAll("p"); // Lấy tất cả thẻ <p>
        const playButton = document.getElementById("play-button");
        const stopButton = document.getElementById("stop-button");

        let voices = [];
        let currentIndex = 0; // Chỉ mục để đọc từng đoạn
        let isPlaying = false;

        // Hàm lấy giọng nói theo tên
        const getVoiceByName = (name) => {
            return (
                voices.find((voice) => voice.name.includes(name)) || voices[0]
            );
        };

        // Hàm đọc từng đoạn văn bản
        const speakParagraph = (index) => {
            if (index >= paragraphs.length || !isPlaying) return;

            const p = paragraphs[index];
            const utterance = new SpeechSynthesisUtterance(
                p.textContent.trimEnd()
            );
            utterance.rate = 1.2;
            utterance.pitch = 1.1;

            // Chọn giọng dựa trên class của <p>
            if (p.classList.contains("speaker-1")) {
                utterance.voice = getVoiceByName("HoaiMy");
            } else if (p.classList.contains("speaker-2")) {
                utterance.voice = getVoiceByName("NamMinh");
            }

            utterance.onend = () => {
                currentIndex++;
                speakParagraph(currentIndex); // Đọc đoạn tiếp theo
            };

            synth.speak(utterance);
        };

        playButton.addEventListener("click", () => {
            voices = synth.getVoices(); // Cập nhật danh sách giọng nói
            if (voices.length === 0) {
                console.warn("Không tìm thấy giọng nói nào.");
                return;
            }

            isPlaying = true;
            currentIndex = 0;
            synth.cancel(); // Hủy bất kỳ giọng nói nào trước đó
            speakParagraph(currentIndex);
        });

        stopButton.addEventListener("click", () => {
            synth.cancel();
            isPlaying = false;
            console.log("Speech synthesis stopped");
        });

        synth.onvoiceschanged = () => {
            voices = synth.getVoices(); // Cập nhật danh sách giọng nói khi có thay đổi
            console.log("Voices updated");
        };
    }
})();
