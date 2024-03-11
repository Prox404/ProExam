import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { createQuestionManually } from "~/services/examService";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";

function ParseQuestions() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isOpenA, setIsOpenA] = useState(false);
  const [statusA, setStatusA] = useState("success");
  const [messageA, setMessageA] = useState("");
  const [deleteEnabled, setDeleteEnabled] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("user"))) {
      navigate("/");
    }
  }, []);
  const [questions, setQuestions] = useState([
    {
      id: uuidv4(),
      // index: indexQuestion,
      questionText: "",
      exam: {
        examId: id,
      },
      answers: Array.from({ length: 2 }, () => ({
        answerText: "",
        isCorrect: false,
      })),
    },
  ]);

  const [answerCounts, setAnswerCounts] = useState(Array(questions.length));

  const handleAddQuestion = () => {
    const newQuestion = {
      id: uuidv4(),
      questionText: "",
      answers: Array.from({ length: 2 }, () => ({
        answerText: "",
        isCorrect: false,
      })),
    };

    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    setAnswerCounts((prevCounts) => [...prevCounts, 2]);
    setDeleteEnabled(true);
    console.log(questions.id);
  };

  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    const question = newQuestions[questionIndex];
    question.answers.push({ answerText: "", isCorrect: false });

    setQuestions(newQuestions);
    const currentAnswerCount = question.answers.length;
    if (currentAnswerCount > 2) {
      setDeleteEnabled(true);
    }
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].answerText = value;
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

              return updatedAnswer;
            }
            return answer;
          });

          const updatedQuestion = {
            ...question,
            answers: updatedAnswers,
          };

          return updatedQuestion;
        }
        return question;
      });

      return updatedQuestions;
    });
  };

  const handleDeleteQuestion = (id) => {
    if (questions.length < 2) {
      setStatusA("warning");
      setMessageA("Need at least one question !");
      setIsOpenA(true);
      return;
    }
    let newQuestions = questions.filter((question) => question.id !== id);
    // console.log(newQuestions);
    setQuestions(newQuestions);
  };

  useEffect(() => {
    const initialDeleteEnabled = questions.some(
      (question) => question.answers.length > 2
    );
    setDeleteEnabled(initialDeleteEnabled);
  }, [questions]);

  const handleDeleteAnswer = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    const question = newQuestions[questionIndex];
    question.answers = question.answers.filter(
      (_, index) => index !== answerIndex
    );
    // console.log(question.answers);
    setQuestions(newQuestions);

    const currentAnswerCount = question.answers.length;
    if (currentAnswerCount <= 2 && deleteEnabled) {
      setDeleteEnabled(false);
    } else if (currentAnswerCount > 2 && !deleteEnabled) {
      setDeleteEnabled(true);
    }
  };

  const checkisValid = () => {
    for (let i = 0; i < questions.length; i += 1) {
      if (questions[i].questionText === "") {
        setMessageA("Question Text Is Not Null!");
        return false;
      }
      let check = false;
      for (let j = 0; j < questions[i].answers.length; j += 1) {
        if (questions[i].answers[j].answerText === "") {
          setMessageA("Answer Text Is Not Null!");
          return false;
        }

        if (questions[i].answers[j].isCorrect === true) {
          check = true;
        }
      }
      if (!check) {
        setMessageA("Please Choose The Correct Answer!");
        return false;
      }
    }
    return true;
  };
  const handleFinish = async () => {
    if (checkisValid()) {
      setIsOpenA(true);
      setStatusA("success");
      setMessageA("Exam Has Created!");
      await createQuestionManually({ questions, examId: id });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      setIsOpenA(true);
      setStatusA("error");
    }
  };

  return (
    <>
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
            key={question.id}
            sx={{
              backgroundColor: theme.palette.cardSecondaryBackground,
              marginBottom: "20px",
              borderRadius: "10px",
              position: "relative",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              padding: "10px",
              height: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
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
            </Box>
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
                    if (
                      deleteEnabled == false &&
                      question.answers.length == 2
                    ) {
                      setStatusA("warning");
                      setMessageA("Need at least two answer !");
                      setIsOpenA(true);
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Checkbox
                  color="info"
                  checked={answer.isCorrect}
                  onChange={() => handleCorrectAnswerChange(index, answerIndex)}
                />

                <TextField
                  label={`Answer ${answerIndex + 1}`}
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={question.answers[answerIndex].answerText}
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
          onClick={handleFinish}
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
      <Snackbar
        open={isOpenA}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            setIsOpenA(false);
          }
        }}
      >
        <Alert severity={statusA} variant="filled" sx={{ width: "100%" }}>
          {messageA}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ParseQuestions;
