import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";


function ParseQuestions() {
  const theme = useTheme();

  const [deleteEnabled, setDeleteEnabled] = useState(true);

  const [questions, setQuestions] = useState([
    {
      question: "",
      answers: Array.from({ length: 2 }, () => ({
        answer_text: "",
        isCorrect: false,
      })),
    },
  ]);

  const [answerCounts, setAnswerCounts] = useState(Array(questions.length).fill(4));

  const handleAddQuestion = () => {
    const newQuestion = {
      question: "",
      answers: Array.from({ length: 2 }, () => ({
        answer_text: "",
        isCorrect: false,
      })),
    };

    console.log("New Question:", newQuestion);

    setQuestions([...questions, newQuestion]);
    setAnswerCounts([...answerCounts, 4]);
    const newAnswerCount = 7;
    if (newAnswerCount > 2) {
      setDeleteEnabled(true);
    }
  };

  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    const question = newQuestions[questionIndex];
    question.answers.push({ answer_text: "", isCorrect: false });

    console.log("New Answer", newQuestions);

    setQuestions(newQuestions);
    const currentAnswerCount = question.answers.length;
    if (currentAnswerCount > 2) {
      setDeleteEnabled(true);
    }
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].answer_text = value;
    setQuestions(newQuestions);
  };

 
  const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question, idx) => {
        if (idx === questionIndex) {
          const updatedAnswers = question.answers.map((answer, index) => {
            if (index === answerIndex) {
              const updatedAnswer = {
                ...answer,
                isCorrect: !answer.isCorrect,
              };

              console.log(updatedAnswer); 

              return updatedAnswer;
            }
            return answer;
          });
  
          const updatedQuestion = {
            ...question,
            answers: updatedAnswers,
          };

          console.log(updatedQuestion); 

          return updatedQuestion;
        }
        return question;
      });
  
      return updatedQuestions;
    });
  };
  

  const handleDeleteAnswer = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    const question = newQuestions[questionIndex];
    question.answers.splice(answerIndex, 1);
    setQuestions(newQuestions);
    const currentAnswerCount = question.answers.length;
    if (currentAnswerCount <= 2) {
      setDeleteEnabled(false);
    } else if (!deleteEnabled && currentAnswerCount > 2) {
      setDeleteEnabled(true);
    }
  };

  return (
    <Box
      height={"calc(100vh - var(--header-height))"}
      sx={{
        color: theme.palette.white,
        padding: {
          xs: "10px",
          sm: "20px",
          md: "40px",
        },
        zIndex: "-1",
      }}
    >
      {questions.map((question, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: "#7c8db5",
            marginBottom: "20px",
            borderRadius: "10px",
            position: "relative",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            padding: "10px",
            height: "auto",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              label={`Question ${index + 1}:`}
              variant="outlined"
              fullWidth
              value={question.question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              sx={{
                marginBottom: "10px",
              }}
            />
          </Box>

          {question.answers.map((answer, answerIndex) => (
            <Box
              key={answerIndex}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <IconButton
                sx={{
                  color: theme.palette.trashColor,
                  marginRight: "5px",
                  "&:hover": {
                    color: "#435ebe",
                  },
                }}
                onClick={() => {
                  if (deleteEnabled) {
                    handleDeleteAnswer(index, answerIndex);
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
              <Checkbox
                color="primary"
                checked={answer.isCorrect}
                onChange={() => handleCorrectAnswerChange(index, answerIndex)}
              />

              <TextField
                label={`Answer ${answerIndex + 1}`}
                variant="outlined"
                fullWidth
                size="small"
                value={answer.answer_text}
                onChange={(e) =>
                  handleAnswerChange(index, answerIndex, e.target.value)
                }
                sx={{ marginLeft: "5px" }}
              />
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={() => handleAddAnswer(index)}
            sx={{
              color: theme.palette.textColorSecondary,
              textTransform: "none",
            }}
          >
            Add answer
          </Button>
        </Box>
      ))}

      <Button
        variant="contained"
        onClick={handleAddQuestion}
        sx={{
          borderRadius: "10px",
          padding: "13px 26px",
          lineHeight: "20px",
          marginRight: { xs: "5px" },
          textTransform: "none",
        }}
      >
        +Create new question
      </Button>

      <Button
        variant="contained"
        sx={{
          borderRadius: "10px",
          padding: "13px 26px",
          lineHeight: "20px",
          float: "right",
          textTransform: "none",
        }}
      >
        Finish
      </Button>
    </Box>
  );
}

export default ParseQuestions;
