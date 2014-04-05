if (Function.prototype.bind && /^object$|^function$/.test(typeof console) && typeof console.log === 'object' && typeof window.addEventListener === 'function') {
    ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd']
        .forEach(function(method) {
            console[method] = this.call(console[method], console);
        }, Function.prototype.bind);
}
