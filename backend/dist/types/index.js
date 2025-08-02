// Новые типы для системы статусов
export var UserStatus;
(function (UserStatus) {
    UserStatus["INTERVIEWER"] = "INTERVIEWER";
    UserStatus["CANDIDATE"] = "CANDIDATE";
})(UserStatus || (UserStatus = {}));
export var InterviewStatus;
(function (InterviewStatus) {
    InterviewStatus["PENDING"] = "PENDING";
    InterviewStatus["COMPLETED"] = "COMPLETED";
    InterviewStatus["FEEDBACK_RECEIVED"] = "FEEDBACK_RECEIVED";
})(InterviewStatus || (InterviewStatus = {}));
//# sourceMappingURL=index.js.map