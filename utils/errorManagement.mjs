const Error = (message, code, err) => ({
    message,
    code: code || 400,
    error: (err) ? err : undefined
});

export default Error;