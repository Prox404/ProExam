create database ProExam
drop database ProExam

create table test(
	test varchar(20)
)

insert into test values ('Connected')

create table Users(
	UserID VARCHAR(100) PRIMARY KEY,
	UserName NVARCHAR(50),
	UserPassword TEXT,
	UserEmail VARCHAR(50)
)

alter table Users add unique(UserEmail)

create table Exam(
	ExamID  VARCHAR(100) PRIMARY KEY,
	ExamName  NVARCHAR(50),
	ExamStartTime  DateTime,
	ExamEndTime  DateTime,
	UserID  VARCHAR(100),
	NumberSubmit  int,
	KeyCode  int
)

create table Question(
	QuestionID  VARCHAR(100),
	ExamID  VARCHAR(100),
	QuestionText  NVARCHAR(MAX),
	PRIMARY KEY (QuestionID)
)

create table Answer(
	AnswerID  VARCHAR(100),
	QuestionID  VARCHAR(100),
	AnswerText  NVARCHAR(MAX),
	IsCorrect   BIT,
	PRIMARY KEY (AnswerID)
)

create table ExamResult(
	ExamResultID  VARCHAR(100),
	UserAnswerID  VARCHAR(100) ,
	ExamID   VARCHAR(100),
	Score  Float,
	StartTime  DateTime,
	EndTime  DateTime,
	PRIMARY KEY (ExamResultID)
)

create table UserAnswer(
	UserAnswerID  VARCHAR(100),
	UserAnswerName  NVARCHAR(50),
	UserAnswerEmail  NVARCHAR(50),
	PRIMARY KEY (UserAnswerID)
)

create table History(
	ExamResultID  VARCHAR(100),
	SelectedAnswerID VARCHAR(100),
	QuestionID VARCHAR(100),
	PRIMARY KEY (ExamResultID, SelectedAnswerID, QuestionID)
)

--relationships
alter table Exam add constraint FK_Exam_User foreign key (UserID) references Users(UserID)
alter table Question add constraint FK_Question_Exam foreign key (ExamID) references Exam(ExamID)
alter table Answer add constraint FK_Answer_Question foreign key (QuestionID) references Question(QuestionID)
alter table ExamResult add constraint FK_ExamResult_UserAnswer foreign key (UserAnswerID) references UserAnswer(UserAnswerID)
alter table ExamResult add constraint FK_ExamResult_Exam foreign key (ExamID) references Exam(ExamID)
alter table History add constraint FK_History_ExamResult foreign key (ExamResultID) references ExamResult(ExamResultID)
alter table History add constraint FK_History_Answer foreign key (SelectedAnswerID) references Answer(AnswerID)
alter table History add constraint FK_History_Question foreign key (QuestionID) references Question(QuestionID)

select * from users