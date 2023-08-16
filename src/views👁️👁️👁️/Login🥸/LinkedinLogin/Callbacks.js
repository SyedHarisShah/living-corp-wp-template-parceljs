//calls to server

import { showModal, showMessage } from "./Dialog";

const setupParams = (acf, code) => {
    const base_url = acf.base;
    const client_id = acf.linkedin_api.client_id;
    const client_secret = acf.linkedin_api.client_secret;
    const redirect_uri = `${base_url}/login/`;

    const json_params = {
        grant_type: "authorization_code",
        code,
        client_id,
        client_secret,
        redirect_uri,
    };

    return json_params;
}

//access token and profile called on backend due to cors
const loginWithLinkedin = async (acf, code) => {
    const base_url = acf.base;
    const url = `${base_url}/wp-json/csskiller/v1/linkedin-login/`;

    if(!base_url || !code){
        // error
        showMessage("Authentication error");
        return false;
    }

    const json_params = setupParams(acf, code);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(json_params),
    });

    if(response.status != 200){
        //show error
        showMessage("LinkedIn not connected an account");
        return false;
    }

    const json = await response.json();

    if(json){
        window.loginFinished = json;
    }

    return json;
};

const registerWithLinkedin = async (acf, code) => {
    const base_url = acf.base;
    const url = `${base_url}/wp-json/csskiller/v1/linkedin-register/`;

    if(!base_url || !code){
        // error
        showMessage("Authentication error", "signuptab");
        return false;
    }

    const json_params = setupParams(acf, code);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(json_params),
    });

    if(response.status != 200){
        //show error
        showMessage("Email/LinkedIn already connected an account", "signuptab");
        return false;
    }

    const json = await response.json();

    if(json){
        window.registerFinished = json;
        showMessage("Signup successful!", "signuptab");
    }

    return json;
}

const connectLinkedin = async (acf, code, user) => {
    const base_url = acf.base;
    const email = user.user.data.user_email;
    const url = `${base_url}/wp-json/csskiller/v1/linkedin-connect/`;

    if(!base_url || !code || !email){
        // error
        showModal("Error connecting linkedin", "An error occurred during connection");
        return false;
    }

    const json_params = setupParams(acf, code);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({...json_params, email})
    });

    if(response.status != 200){
        //show error
        showModal("Error connecting linkedin", "This linkedin is already connected to an account");
        return false;
    }

    const json = await response.json();

    showModal("Success", "LinkedIn account was connected successfully");
    
    if(json){
        window.liConnected = true;
    }
    
    return json;
}

const disconnectLinkedin = async (acf, user, pass, showMessage) => {
    const base_url = acf.base;
    const email = user.user.data.user_email;
    const url = `${base_url}/wp-json/csskiller/v1/linkedin-disconnect/`;

    if(!base_url || !email || !pass){
        // error
        showMessage("An error occurred during disconnection");
        return false;
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({email, pass})
    });

    if(response.status != 200){
        //show error
        showMessage("This linkedin is not connected to an account");
        return false;
    }

    const json = await response.json();

    showMessage("LinkedIn account was disconnected successfully");
    
    if(json){
        window.liDisconnected = true;
        showMessage("LinkedIn account was disconnected successfully");

        setTimeout(() => {
            const modal = document.querySelector(".disLIModal");
            const bg = modal.querySelector(".disLIModal__bg");
            const body = modal.querySelector(".disLIModal__body");
    
            bg.style.opacity = 0;
            body.style.opacity = 0;

            setTimeout(() => (modal.style.display = "none"), 350);
        }, 1500)
    }
    
    return json;
}

export { loginWithLinkedin, registerWithLinkedin, connectLinkedin, disconnectLinkedin}