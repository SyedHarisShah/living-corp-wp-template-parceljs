import {
    connectLinkedin,
    loginWithLinkedin,
    registerWithLinkedin,
    disconnectLinkedin,
} from "./Callbacks";
import { getLoadingWheel, showMessage } from "./Dialog";

const api_url = "https://api.linkedin.com";

const startAuthFlow = async (acf, callback, user = "") => {
    const base_url = acf.base;
    const url = `${api_url}/oauth/v2/authorization?`;
    const client_id = acf.linkedin_api.client_id;
    const client_secret = acf.linkedin_api.client_secret;
    const redirect_uri = `${base_url}/login/`;
    const scope = "r_liteprofile r_emailaddress";
    const state = Math.random().toString(36).slice(2); // generate random alpha-numeric string for verification

    if (!client_id || !client_secret) {
        return false;
    }

    const json_params = {
        response_type: "code",
        client_id,
        client_secret,
        redirect_uri,
        state,
        scope,
    };

    const popup = createPopup(url, json_params);

    let authcode;

    setTimeout(async () => {
        const checkPopup = setInterval(async () => {
            try {
                if (popup?.location?.href?.includes(redirect_uri)) {
                    //get bearer token from url
                    const params = new Proxy(
                        new URLSearchParams(popup.location.search),
                        {
                            get: (searchParams, prop) => searchParams.get(prop),
                        }
                    );

                    authcode = params.code ?? "";

                    //verify state
                    if (state === params.state) {
                        callback(acf, authcode, user);
                    } else {
                        showMessage("Error during authentication");
                    }

                    popup.close();
                }

                if (!popup || !popup.closed) {
                    clearInterval(checkPopup);
                    return;
                }
            } catch (err) {
                if (!err instanceof DOMException) {
                    console.error(err);
                }
            }
        }, 500);
    }, 500);
};

const linkedInLogin = async (acf) => {
    return await startAuthFlow(acf, loginWithLinkedin);
};

const linkedInRegister = async (acf) => {
    return await startAuthFlow(acf, registerWithLinkedin);
};

const linkedInConnect = async (acf, user) => {
    return await startAuthFlow(acf, connectLinkedin, user);
};

const linkedInDisconnect = async (acf, user, passField) => {
    const modal = document.querySelector(".disLIModal");
    const bg = modal.querySelector(".disLIModal__bg");
    const body = modal.querySelector(".disLIModal__body");

    modal.style.display = "unset";
    setTimeout(() => (bg.style.opacity = 1.0), 50);
    setTimeout(() => (body.style.opacity = 1.0), 50);

    const btn =  modal.querySelector(".btnDisConf")

    btn.addEventListener("click", async () => {
        passField.check()
      
        if(modal.querySelector('.err')){
          return;
        }

        btn.querySelector(".btn_t").innerHTML = getLoadingWheel();

        const pass = encodeURIComponent(passField.DOM.npt.value);
    
        return await disconnectLinkedin(acf, user, pass, (message) => {
            const messageElem = modal.querySelector(".disLIModal__message");
            btn.querySelector(".btn_t").innerHTML = "CONFIRM DISCONNECT";
    
            if (message) {
                messageElem.innerHTML = message;
    
                messageElem.style.maxHeight = "100%";
                messageElem.style.padding = "1rem";
                setTimeout(() => {
                    messageElem.style.maxHeight = 0;
                    messageElem.style.padding = 0;
                }, 3300);
            }
        });
    });
};

const createPopup = (url, json_params) => {
    const query_params = new URLSearchParams(json_params);

    const width = 450;
    const height = 600;
    const top = screen.height / 2 - height / 2;
    const left = screen.width / 2 - width / 2;

    const popup = window.open(
        url + query_params,
        "lc_linkedin_login",
        `menubar=no,location=no,resizable=no,scrollbars=no,status=no,popup=true,width=${width},height=${height},top=${top},left=${left}`
    );

    if (window.focus) {
        popup.focus();
    }

    return popup;
};

export { linkedInLogin, linkedInRegister, linkedInConnect, linkedInDisconnect };
