const className = ".li_dialog";
let btn = document.querySelector(`${className}__btn`);

const showModal = (titleTxt = "", messageTxt = "") => {
    const modal = document.querySelector(className);
    const bg = modal.querySelector(`${className}__bg`);
    const body = modal.querySelector(`${className}__body`);
    const title = body.querySelector(`${className}__title`);
    const message = body.querySelector(`${className}__content p`);

    if (!btn) {
        btn = modal.querySelector(`${className}__btn`);
        btn.addEventListener("click", () => showModal());
    }

    if (titleTxt && messageTxt) {
        modal.style.display = "unset";
        title.innerHTML = titleTxt.toUpperCase();
        message.innerHTML = messageTxt.toUpperCase();
        setTimeout(() => (bg.style.opacity = 1.0), 50);
        setTimeout(() => (body.style.opacity = 1.0), 50);
        // setTimeout(showModal, 5000);
    } else {
        bg.style.opacity = 0;
        body.style.opacity = 0;
        setTimeout(() => (modal.style.display = "none"), 350);
    }
};

const showMessage = (message, className = "logintab") => {
    const errorNode = document.querySelector(`.${className} .error-3`);

    errorNode.innerHTML = message;

    errorNode.classList.add("act");
    setTimeout(() => {
        errorNode.classList.remove("act");
    }, 3300);
};

const getLoadingWheel = () => {
    return '<div class="loading-wheel"><div></div><div></div><div></div><div></div></div>';
};

export { showModal, showMessage, getLoadingWheel };
