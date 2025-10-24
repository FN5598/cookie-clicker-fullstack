import "./LoginPage.css";

export function LoginPage() {
    return (
        <div class="login-container">
            <div class="login-wrapper">
                <h1>Login</h1>
                <div class="email-container">
                    <p>Email</p>
                    <input id="email-input" placeholder="Write your Email here" autocomplete="off" />
                </div>
                <div class="password-container">
                    <p>Password</p>
                    <input id="password-input" placeholder="Write your Password here" autocomplete="off" />
                </div>
                <button id="login-button">LOGIN</button>
                <div class="sign-in-link">
                    <p>Or Sign In Here</p>
                    <a href="/users/register">SIGN IN</a>
                </div>
            </div>
        </div>
    );
}