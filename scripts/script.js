function saveAnswersAndNext(startQuestion, endQuestion, nextPage) {
    // 모든 문항이 응답되었는지 확인
    for (let i = startQuestion; i <= endQuestion; i++) {
        const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
        if (!selectedOption) {
            alert(`문항 ${i}에 응답해 주세요.`);
            return; // 응답되지 않은 경우 함수 종료
        }
        // 응답된 값 로컬 스토리지에 저장
        localStorage.setItem(`q${i}`, selectedOption.value);
    }
    // 모든 응답이 완료되면 다음 페이지로 이동
    window.location.href = nextPage;
}

function calculateAndRedirect() {
    // 나트륨 문항 (1-10, 21-30)
    let sodiumScore = 0;
    for (let i = 1; i <= 10; i++) {
        sodiumScore += parseInt(localStorage.getItem(`q${i}`) || "0", 10);
    }
    for (let i = 21; i <= 30; i++) {
        sodiumScore += parseInt(localStorage.getItem(`q${i}`) || "0", 10);
    }

    // 당류 문항 (11-20, 31-40)
    let sugarScore = 0;
    for (let i = 11; i <= 20; i++) {
        sugarScore += parseInt(localStorage.getItem(`q${i}`) || "0", 10);
    }
    for (let i = 31; i <= 40; i++) {
        sugarScore += parseInt(localStorage.getItem(`q${i}`) || "0", 10);
    }

    // 조건에 따라 결과 페이지로 이동
    if (sodiumScore > 50 && sugarScore > 50) {
        window.location.href = "../results/result1.html"; // result1.html 경로
    } else if (sodiumScore > 50) {
        window.location.href = "../results/result2.html"; // result2.html 경로
    } else if (sugarScore > 50) {
        window.location.href = "../results/result3.html"; // result3.html 경로
    } else {
        window.location.href = "../results/result4.html"; // result4.html 경로
    }
}
