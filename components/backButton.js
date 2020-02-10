import Router from "next/router";

const BackButton = () => {
  return (
    <div
      onClick={() => Router.back()}
      className="align-items-sm-center btn btn-outline-primary"
    >
      <i className="fas fa-long-arrow-alt-left"></i> Nazaj
    </div>
  );
};
export default BackButton;
