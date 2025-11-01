const Footer = () => {
    return (
        <footer
            className="text-center py-4 mt-5"
            style={{
                backgroundColor: "var(--bg-card)",
                borderTop: "1px solid var(--border)",
                color: "var(--text-muted)",
            }}
        >
            <p className="mb-1">
                &copy; {new Date().getFullYear()}{" "}
                <span style={{ color: "var(--accent)", fontWeight: "600" }}>
                    Electron.store
                </span>
            </p>
            <p className="small mb-0">Powered by React ⚡ & Node.js</p>
        </footer>
    );
};

export default Footer;
