import Layout from "@/components/layout/Layout";

const Contact = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Contact</h1>
        <div className="prose prose-lg text-foreground">
          <p className="text-lg mb-4">
            I'd love to hear from you! Whether you have questions, feedback, or just want to connect.
          </p>
          <p className="text-lg">
            Feel free to reach out through social media or email.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
