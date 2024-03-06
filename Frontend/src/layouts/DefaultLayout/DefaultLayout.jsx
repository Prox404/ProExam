
import PropTypes from 'prop-types';
import Header from '~/components/Header';
import styles from './DefaultLayout.module.scss';
function DefaultLayout({ children}) {
    return (
        <div className={styles['main-app']}>
            <div className={styles['background']}></div>
            <Header className={styles['header']}></Header>
            <div className={styles['content']}>
                {children}</div>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node,
};

export default DefaultLayout;