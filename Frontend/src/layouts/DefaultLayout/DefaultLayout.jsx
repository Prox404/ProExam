
import PropTypes from 'prop-types';

function DefaultLayout({ children}) {
    return (
        <div className="main-layout">
            {/* <Header></Header> */}
            <div className="content">{children}</div>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node,
};

export default DefaultLayout;