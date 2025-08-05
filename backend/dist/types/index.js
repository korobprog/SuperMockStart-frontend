// User roles enum
export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
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