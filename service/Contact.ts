import { IContactForm } from "@/types";

class ContactService {
  async sendEmail(params: IContactForm) {
    try {
      const response = await fetch("/api/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        console.log("Email sent successfully: " + response);
        return response.json();
      }
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  }
}

const ContactServiceInstance = new ContactService();

export default ContactServiceInstance;
