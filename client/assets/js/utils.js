function displayErrorToast(message) {
  let toast_container = $(".toasts");
  if (!toast_container.length) {
    $(".interaction").prepend(`<div class="toasts"></div>`);
    toast_container = $(".toasts");
  }
  toast_container.html(`
        <div class="toast bg-danger text-white fade show errorToast">
      <div class="toast-header bg-danger text-white">
        <strong class="me-auto"
          ><i class="fa-solid fa-circle-xmark"></i> Error
        </strong>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="toast"
        ></button>
      </div>
      <div class="toast-body">${message}</div>
    </div>`);
}

function displayNotiToast(message) {
  let toast_container = $(".toasts");
  if (!toast_container.length) {
    $(".interaction").prepend(`<div class="toasts"></div>`);
    toast_container = $(".toasts");
  }
  toast_container.html(`
        <div class="toast bg-primary text-white fade show" id="notiToast">
      <div class="toast-header bg-primary text-white">
        <strong class="me-auto"
          ><i class="fa-solid fa-circle-exclamation"></i> Notification
        </strong>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="toast"
        ></button>
      </div>
      <div class="toast-body">${message}</div>
    </div>`);
}

function showLoadingIcon() {
  let loadingIconContainer = $(".loading_icon");
  if (!loadingIconContainer.length) {
    $("body").prepend(`<div class="loading_icon"></div>`);
    return showLoadingIcon();
  }
  loadingIconContainer.html(`
      <div class="music-waves-2">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>`);
  $("*").css("overflow", "hidden");
}

function hideLoadingIcon() {
  $("*").css("overflow", "");
  const loadingIconContainer = $(".loading_icon");
  if (!loadingIconContainer.length) return;
  loadingIconContainer.remove();
}

const ElapsedTimeConverter = (timestamp) => {
  const created = timestamp.getTime();
  let periods = {
    year: 365 * 30 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
  };
  let diff = Date.now() - created;

  let finalResult = "Just now";

  Object.entries(periods)
    .reverse()
    .map((entry) => {
      if (diff >= entry[1]) {
        let result = Math.floor(diff / entry[1]);
        finalResult = `${result} ${
          result === 1 ? entry[0] : entry[0] + "s"
        } ago`;
      }
    });

  return finalResult;
};
