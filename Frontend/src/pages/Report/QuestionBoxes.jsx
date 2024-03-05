import React from "react";

const renderQuestionBoxes = (questions) => {
    return questions.map((question, index) => {
        const boxStyle = {
            width: 20,
            height: 20,
            borderRadius: 4,
            marginRight: 2,
            backgroundColor: question.iscorrect === 'true' ? "rgb(0, 201, 133)" : "#ec0b43",
        };

        return (
            <div key={index} style={boxStyle}>
                {/* Content of the box */}
            </div>
        );
    });
};

const QuestionBoxes = ({ questions }) => {
    return <div style={{display:"flex",justifyContent:"center"}}>{renderQuestionBoxes(questions)}</div>;
};

export default QuestionBoxes;
