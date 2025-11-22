import Layout from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">About</h1>
        <div className="prose prose-lg text-foreground">
          <p className="text-lg">
            Welcome to my blog! I'm passionate about sharing insights on travel, technology, 
            lifestyle, and everything in between.
          </p>
          <p className="text-lg">
            Through my writing, I aim to inspire and inform readers with authentic stories 
            and practical advice drawn from real experiences.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
