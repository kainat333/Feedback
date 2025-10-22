import { GoogleLogin } from "@react-oauth/google";

const GoogleAuthButton = ({ onSuccess, onError, text = "signin_with" }) => {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      useOneTap
      text={text}
      theme="outline"
      size="large"
      width="100%"
    />
  );
};

export default GoogleAuthButton;
