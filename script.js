// 응답을 저장하는 함수
function saveResponse(question, answer) {
    // 기존 데이터를 가져오기
    const responses = JSON.parse(localStorage.getItem('responses')) || {};

    // 응답 저장
    responses[question] = answer;

    // 업데이트된 데이터를 localStorage에 저장
    localStorage.setItem('responses', JSON.stringify(responses));

    // 다음 페이지로 이동
    if (question === "question1") {
        window.location.href = "question2.html";
    } else if (question === "question2") {
        window.location.href = "result.html";
    }
}

// 결과 페이지에 응답 표시
function displayResults() {
    // localStorage에서 데이터를 가져오기
    const responses = JSON.parse(localStorage.getItem('responses')) || {};

    const responseList = document.getElementById("response-list");

    // 응답에 따라 결과 메시지 생성
    if (responses.question1 === "예") {
        const li = document.createElement("li");
        li.textContent = "당신은 탕후루를 좋아하는 사람입니다.";
        responseList.appendChild(li);
    }

    if (responses.question2 === "예") {
        const li = document.createElement("li");
        li.textContent = "당신은 감튀를 좋아하는 사람입니다.";
        responseList.appendChild(li);
    }

    // 응답이 없는 경우
    if (!responseList.hasChildNodes()) {
        const li = document.createElement("li");
        li.textContent = "당신은 특별한 취향이 없는 사람일 수도 있습니다.";
        responseList.appendChild(li);
    }
}

// 시작 버튼 클릭 시 첫 번째 질문으로 이동
function startQuiz() {
    window.location.href = "question1.html";
}
