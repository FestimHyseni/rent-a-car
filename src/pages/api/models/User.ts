export interface User{
    
    name: string;
    email: string;
    password: string;
    emailVerified: Date | null;
    image: string;
    role: "user" | "admin"; // Define roles
    createdAt: Date;
}