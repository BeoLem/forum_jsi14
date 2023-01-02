document.addEventListener("DOMContentLoaded", function (document) {
  $(document).ready(function ($) {
    const path = $(location).attr("pathname");
    if (path.startsWith("/auth")) return;
    $('a[href*="/auth/login"]').attr("href", `/auth/login?redirect=${path}`);
    $('a[href*="/auth/login/"]').attr("href", `/auth/login?redirect=${path}`);
  });
});
