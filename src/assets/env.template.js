(function(window) {
    window["env"] = window["env"] || {};

    // Environment variables
    window["env"]["baseUrl"] = "${BASEURL}";
    window["env"]["intranetUrl"] = "${INTRA_URL}";
    window["env"]["intranetBackendUrl"] = "${INTRA_BACKEND_URL}";
    window["env"]["ssoUrl"] = "${SSO_URL}"
    window["env"]["timeUiUrl"] = "${TIME_UI_URL}";
    window["env"]["timeBackendUrl"] = "${TIME_BACKEND_URL}";
    window["env"]["enforcePasswordPolicy"] = "${FLAG_PASSWORDPOLICY}";
    window["env"]["matomoSiteId"] = "${MATOMO_SITE_ID}";
    window["env"]["matomoURL"] = "${MATOMO_URL}";
    window["env"]["matomoEnabled"] = "${MATOMO_ENABLED}";
})(this);
