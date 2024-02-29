import 'animate.css';
import { Box, Button, Typography, Slider, SvgIcon } from '@mui/material'
import Header from '../../components/Header'
import React from 'react'
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material';
import Check from '~/assets/Check.svg';
import Close from '~/assets/Close.svg';
import BoxSearch from '~/assets/BoxSearch.svg';
import styles from './ViewScoreExam.module.scss'

const ViewScoreExam = () => {
  const theme = useTheme();
  const accuracy = 100;
  const correctScore = 20;
  const incorrectScore = 5;
  const Unattempted = 0;
  return (
    <div>
      <Header />
      <Grid sx={{
        background: theme.palette.defaultBackground,
        width: '100%',

      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px',
          padding: '30px 0px ',
        }}>
          {/* box dad 1 */}
          <Box sx={{
            backgroundColor: theme.palette.primaryCard,
            width: '80%',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: '10px'


          }}>
            {/* box th vang ngu lz */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: {
                xs: '10px',
                sm: '60px'
              },
              flexDirection: {
                xs: 'column',
                sm: 'row'
              }
            }}>
              {/* box left */}
              <Box sx={{
                display: 'flex',
                justifyContent: {
                  xs: 'center',
                  sm: 'right'
                },
                top: '50%',
                alignItems: 'center',
                borderRadius: '50%',
                overflow: 'hidden'
              }}
              >
                <img className={`${styles['image']}`} src="src/assets/user-img.png" alt="avatar" />
              </Box>
              {/* box right */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                justifyContent: 'center',
                top: '50%',
                alignItems: {
                  xs: 'center',
                  sm: 'left'
                }
              }}>
                <Typography sx={{
                  fontWeight: 'bold',
                  fontSize: '24px',
                  color: '#fff',
                  textAlign: 'center'
                }}>
                  UserName
                </Typography>
                <Button sx={{
                  background: '#8594ca',
                  color: '#fff',
                  width: '220px',
                  borderRadius: '15px',
                  height: '60px',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  '&:hover': {
                    background: '#fff',
                    color: '#8594ca'
                  }
                }}>
                  View Answer
                </Button>
              </Box>
            </Box>
          </Box>
          {/* box dad 2 */}
          <Box sx={{
            background: theme.palette.primaryCard,
            width: '80%',
            height: '130px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: '10px',
            padding: '0 4%',
          }}>
            <Box>
              {/*accuracy number */}
              <Typography sx={{
                fontWeight: 'bold',
                lineHeight: '35px',
                fontSize: '25px',
                color: '#fff'
              }}>
                Accurary
              </Typography>
              <Box className={`${styles['accuracy']}`} sx={{
                width: '55px',
                height: '35px',
                background: '#fff',
                borderRadius: '15px',
                display: 'flex',
                justifyContent: 'center', // Căn giữa theo chiều ngang
                alignItems: 'center', // Căn giữa theo chiều dọc
                marginLeft: {
                  xs: `${accuracy - 8}%`,
                  sm: `${accuracy - 2.5}%`
                },
                marginBottom: '5px',
              }}>
                <Typography sx={{
                  fontWeight: 'bold',
                  lineHeight: '20px',
                  fontSize: '20px',
                  color: '#E05151'
                }}>
                  {accuracy}%
                </Typography>
              </Box>
              <Slider color='primary' disabled defaultValue={accuracy} sx={{
                height: {
                  xs: '15px',
                  sm: '25px'
                },
                color: 'red',
                '& .MuiSlider-thumb': {
                  width: {
                    xs: '25px',
                    sm: '50px'
                  },
                  height: {
                    xs: '25px',
                    sm: '50px'
                  },
                  color: '#E05151'
                  // Nguyễn Trần Anh Thắng
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#E05151',
                  borderColor: '#E05151',
                },
              }} />
            </Box>
          </Box>

          {/* box dad 3 */}
          <Box sx={{
            background: theme.palette.primaryCard,
            width: '80%',
            height: 'auto',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            borderRadius: '10px',
            alignItems: 'center',
            textAlign: 'center',
            // gap: {
            //   xs: 1,
            //   sm: 20
            // },
            flexWrap: 'wrap',
            padding: {
              xs: '10px',
              sm: '10px'
            }
          }}>
            {/* box correct */}
            <Box sx={{
              width: {
                xs: '80%',
                sm: '20%'
              },
              minHeight: '90px',
              background: '#8594ca',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: {
                xs: '10px',
                sm: '10px'
              }
              // gap: '5px',
            }}>
              <Box className="boxTop">
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '20px',
                  gap: '5px'
                }}>
                  <Box className="iconBox" sx={{
                    marginTop: '5px'
                  }}>
                    <img src={Check} alt='check'></img>
                  </Box>
                  <Box className="correctScore">
                    <Typography sx={{
                      fontSize: '35px',
                      fontWeight: 'bold',
                      color: '#fff',
                    }}>{correctScore}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box className="boxBot">
                <Typography fontSize={'20px'} color={'#fff'}>Correct</Typography>
              </Box>
            </Box>
            {/* box incorrect */}
            <Box sx={{
              width: '20%',
              minHeight: '90px',
              background: '#8594ca',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              // gap: '5px',
              width: {
                xs: '80%',
                sm: '20%'
              },
              margin: {
                xs: '10px',
                sm: '10px'
              }
            }}>
              <Box className="boxTop">
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '20px',
                  gap: '5px'
                }}>
                  <Box className="iconBox" sx={{
                    marginTop: '5px'
                  }}>
                    <img src={Close} alt='check'></img>
                  </Box>
                  <Box className="correctScore">
                    <Typography sx={{
                      fontSize: '35px',
                      fontWeight: 'bold',
                      color: '#fff',
                    }}>{incorrectScore}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box className="boxBot">
                <Typography fontSize={'20px'} color={'#fff'}>Incorrect</Typography>
              </Box>
            </Box>

            {/* box Unattempted */}
            <Box sx={{
              width: '20%',
              minHeight: '90px',
              background: '#8594ca',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              // gap: '5px',
              width: {
                xs: '80%',
                sm: '20%'
              },
              margin: {
                xs: '10px',
                sm: '10px'
              }
            }}>
              <Box className="boxTop">
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '20px',
                  gap: '5px'
                }}>
                  <Box className="iconBox" sx={{
                    marginTop: '5px'
                  }}>
                    <img src={BoxSearch} alt='check'></img>
                  </Box>
                  <Box className="correctScore">
                    <Typography sx={{
                      fontSize: '35px',
                      fontWeight: 'bold',
                      color: '#fff',
                    }}>{Unattempted}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box className="boxBot">
                <Typography fontSize={'20px'} color={'#fff'}>Unattempted</Typography>
              </Box>
            </Box>

          </Box>
        </Box>
      </Grid>
    </div>
  )
}

export default ViewScoreExam