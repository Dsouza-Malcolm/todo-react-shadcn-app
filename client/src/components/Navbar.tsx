import MaxWidthWrapper from "./MaxWidthWrapper";

const Navbar = () => {
  return (
    <nav>
      <MaxWidthWrapper className="flex justify-center items-center px-4 py-6">
        <h1 className="text-2xl font-bold text-zinc-600">TodoFlow</h1>
      </MaxWidthWrapper>
      <div className="bg-zinc-100 h-px w-full" />
    </nav>
  );
};

export default Navbar;
