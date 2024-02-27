import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Typography,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";

function ParseQuestions() {
  const theme = useTheme();
  const [deleteEnabled, setDeleteEnabled] = useState(true);

  const [questions, setQuestions] = useState([
    {
      id: uuidv4(),
      question: "",
      answers: [
        {
          answer_text: "",
          isCorrect: false,
        },
      ],
      correctAnswers: [],
    },
  ]);

  const [questionTypes, setQuestionTypes] = useState([
    { id: questions[0].id, type: "an_answer" },
  ]);
  const [answerCounts, setAnswerCounts] = useState(
    Array(questions.length).fill(4)
  );

  const handleAddQuestion = () => {
    const newQuestion = {
      id: uuidv4(),
      question: "",
      answers: [
        {
          answer_text: "",
          isCorrect: false,
        },
      ],
      correctAnswers: [],
    };

    setQuestions([...questions, newQuestion]);
    setQuestionTypes([
      ...questionTypes,
      { id: newQuestion.id, type: "an_answer" },
    ]);
    setAnswerCounts([...answerCounts, 4]);
    //
    const newAnswerCount = 4;
    if (newAnswerCount > 2) {
      setDeleteEnabled(true);
    }
    // console.log(newQuestion.id.uuidv4);
    console.log(questions);
  };

  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    const question = newQuestions[questionIndex];
    question.answers.push("");
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
    console.log(newQuestions[index].question);
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionId, answerIndex) => {
    setQuestions(
      questions.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            correctAnswers:
              questionTypes.find((item) => item.id === questionId).type ===
              "many_answer"
                ? toggleCorrectAnswer(question.correctAnswers, answerIndex)
                : [answerIndex],
            //
            answers: question.answers.map((answer, index) => {
              if (index === answerIndex) {
                return {
                  ...answer,
                  isCorrect: !answer.isCorrect, // Đảo ngược trạng thái isCorrect
                };
              }
              return answer;
            }),
          };
        }
        console.log(answer.isCorrect);

        return question;
      })
    );
  };

  const toggleCorrectAnswer = (currentCorrectAnswers, answerIndex) => {
    const index = currentCorrectAnswers.indexOf(answerIndex);
    if (index === -1) {
      return [...currentCorrectAnswers, answerIndex];
    } else {
      return currentCorrectAnswers.filter((idx) => idx !== answerIndex);
    }
  };

  const handleDeleteQuestion = (id) => {
    const indexToDelete = questions.findIndex((item) => item.id === id);
    if (indexToDelete != -1) {
      let newQuestions = [];
      if (questions.length === 1) {
        newQuestions = [
          {
            id: uuidv4(),
            question: "",
            answers: ["", "", "", ""],
            correctAnswers: [],
          },
        ];
      } else {
        newQuestions = questions.filter((item) => {
          return !(item.id === id);
        });
      }
      setQuestions(newQuestions);
    }
  };

  const handleDeleteAnswer = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    const question = newQuestions[questionIndex];
    question.answers.splice(answerIndex, 1);
    question.correctAnswers = question.correctAnswers.filter(
      (idx) => idx !== answerIndex
    );
    setQuestions(newQuestions);
    const currentAnswerCount = question.answers.length;
    if (currentAnswerCount <= 2) {
      setDeleteEnabled(false);
    } else if (!deleteEnabled && currentAnswerCount > 2) {
      setDeleteEnabled(true);
    }
    console.log(newQuestions);
    console.log(answerIndex);
  };

  const handleTypeChange = (index, value) => {
    const newQuestionTypes = [...questionTypes];
    newQuestionTypes[index] = { id: questions[index].id, type: value };
    setQuestionTypes(newQuestionTypes);
    const newQuestions = questions.map((question, i) => {
      if (i === index) {
        return {
          ...question,
          correctAnswers: [],
        };
      }
      return question;
    });
    setQuestions(newQuestions);
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
            // overflow: "auto",
          }}
        >
          <IconButton
            sx={{
              color: theme.palette.trashColor,
              position: "absolute",
              top: "10px",
              right: "10px",
              "&:hover": {
                color: "#435ebe",
              },
            }}
            onClick={() => handleDeleteQuestion(question.id)}
          >
            <DeleteIcon />
          </IconButton>

          <Typography
            variant="h5"
            sx={{
              color: theme.palette.textBlack,
              marginBottom: "10px",
              fontWeight: "700",
            }}
          >
            Question {index + 1}:
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Question..."
              variant="outlined"
              fullWidth
              value={question.question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              sx={{
                width: {
                  xs: "70%",
                  sm: "85%",
                },
                marginBottom: "10px",
              }}
            />
            <Select
              value={questionTypes[index].type || ""}
              onChange={(e) => handleTypeChange(index, e.target.value)}
              variant="outlined"
              sx={{
                width: {
                  xs: "30%",
                  sm: "15%",
                },
                marginLeft: "10px",
                marginBottom: "10px",
              }}
            >
              <MenuItem value="an_answer">An answer</MenuItem>
              <MenuItem value="many_answer">Many answer</MenuItem>
            </Select>
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
                checked={
                  questionTypes[index].type === "an_answer"
                    ? question.correctAnswers.includes(answerIndex)
                    : question.correctAnswers.includes(answerIndex)
                }
                onChange={() =>
                  handleCorrectAnswerChange(question.id, answerIndex)
                }
              />

              <TextField
                variant="outlined"
                fullWidth
                size="small"
                value={answer}
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
