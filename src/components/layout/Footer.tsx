const Footer = () => {
  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Volodymyr Shcherbyna. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
