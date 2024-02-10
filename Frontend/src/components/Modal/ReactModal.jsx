import Modal from 'react-modal';
import styles from './ReactModal.module.scss';
import PropTypes from 'prop-types';
import 'animate.css';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material';

function ReactModal({ children, size = 'md', ...props }) {
    const theme = useTheme();
    return (
        <div>
            <Modal
                className={`${styles['modal']} ${size === 'sm'
                    ? styles['sm'] : size === 'md' ? styles['md'] :
                        size === 'lg' ? styles['lg'] : styles['max']}
                        animate__animated animate__bounceIn`}
                {
                ...props
                }
                ariaHideApp={false}
                overlayClassName={`${styles['modal-overlay']}`}
                portalClassName={`ReactModalPortal ${styles['modal-portal']}`}
            >
                <Box sx={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: theme.palette.cardBackground,
                    padding: '20px',
                    overflow: 'auto',
                    position: 'relative',
                }}>

                    {
                        children
                    }
                </Box>
            </Modal>
        </div>
    )
}

ReactModal.prototype = {
    children: PropTypes.node
}

export default ReactModal;