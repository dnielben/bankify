import "../../assets/css/common/AppLoader.css";

const AppLoader = ({ text }) => {
    return (
        <div className="loader">
            <div className="loader-wrapper">
                <div
                    className="loader-spinner"
                    style={{ width: 40, height: 40 }}
                />
                {text && <p className="loader-text">{text}</p>}
            </div>
        </div>
    );
};

export default AppLoader;