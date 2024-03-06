import { Box, Typography } from "@mui/material";

const AnswerListItem = ({ answerText, isCorrect, isSelected }) => {
    let icon;
    if (isSelected) {
        icon = isCorrect ? '✔️' : '❌';
    } else {
        icon = isCorrect ? '🚫' : '';
    }

    return (
        <li style={{

        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <Box sx={{ minWidth: '30px', textAlign: 'center' }}>
                    {icon}
                </Box>
                {answerText}
            </Box>
        </li>
    );
};
const ExamResult = ({ examData }) => {
    const { questions = [], histories = [] } = examData;
    console.log(examData);

    return (
        <div>
            {questions.map( (question, index) => {
                const selectedAnswerIds = histories.filter(history => history.questionId === question.questionId).map(history => history.selectedAnswerId);

                return (
                    <div key={question.questionId}>
                        <Typography variant="h6" sx={{
                            marginBottom: 0,
                            fontWeight: '500'
                        }}>
                        <Typography variant="span">
                            {index + 1}.
                        </Typography>
                        {question.questionText}</Typography>
                        <ul style={{
                            listStyleType: 'none',
                            padding: 0,
                            margin: 0
                        }}>
                            {question.answers.map(answer => (
                                <AnswerListItem
                                    key={answer.answerId}
                                    answerText={answer.answerText}
                                    isCorrect={answer.isCorrect}
                                    isSelected={selectedAnswerIds.includes(answer.answerId)}
                                />
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default ExamResult;
