create proc CreateOrAlterHistory(
	@exam_result_id varchar(255),
	@question_id varchar(255),
	@selected_answer_id varchar(255)
)
as
	begin
		if NOT EXISTS (select * from exam_result where exam_result_id = @exam_result_id) 
		OR  NOT EXISTS (select * from question where question_id = @question_id)
		OR  NOT EXISTS (select * from answer where answer_id  = @selected_answer_id)
			begin
				RAISERROR('Invalid',16,1);
				rollback
			end
		else if  NOT EXISTS (select * from history where exam_result_id = @exam_result_id and @question_id = @question_id)
				begin
					insert into history(exam_result_id, question_id, selected_answer_id) values (@exam_result_id, @question_id, @selected_answer_id)
					print'Success'
				end
			else 
				begin
					update history set selected_answer_id = @selected_answer_id where exam_result_id = @exam_result_id and question_id = @question_id
					print'Success'
				end
	end


CREATE OR ALTER TRIGGER update_question_type ON answer AFTER INSERT 
AS 
BEGIN 
    IF (SELECT COUNT(*) FROM answer WHERE question_id = (SELECT question_id FROM inserted) and is_correct = 1) > 1
    BEGIN
        UPDATE question SET question_type = 'MULTIPLE_CHOICE' WHERE question_id = (SELECT question_id FROM inserted)
    END
    ELSE
    BEGIN
        UPDATE question SET question_type = 'SINGLE_CHOICE' WHERE question_id = (SELECT question_id FROM inserted)
    END
END