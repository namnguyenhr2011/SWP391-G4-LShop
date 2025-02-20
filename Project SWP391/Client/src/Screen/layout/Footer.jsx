import { FacebookOutlined, GithubOutlined, GoogleOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';

const Footer = () => {
    return (
        <div className=""  >
            <footer className="bg-dark text-center text-white">
                <div className="p-4 pb-0">
                    <section className="mb-4">
                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><FacebookOutlined /></a>
                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><TwitterOutlined /></a>
                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><GoogleOutlined /></a>
                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><GithubOutlined /></a>
                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"><LinkedinOutlined /></a>
                    </section>
                </div>
                <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    © 2024 Quiz, Inc.
                </div>
                
            </footer>
        </div>

    );
};

export default Footer;