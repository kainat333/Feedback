import { GoogleLogin } from "@react-oauth/google";

const GoogleAuthButton = ({ onSuccess, onError, text }) => {
  return (
    <div className="google-login-btn">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        text={text} //
      />
    </div>
  );
};

export default GoogleAuthButton;
