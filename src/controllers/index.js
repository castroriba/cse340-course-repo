const showHomePage = async (req, res, next) => {
    try {
        const title = 'Home';
        res.render('index', { title });
    } catch (err) {
        next(err);
    }
};

export { showHomePage };