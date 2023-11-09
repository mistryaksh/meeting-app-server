export interface SignUpProps {
     name: NameProps;
     username: string;
     email: string;
     password: string;
     _id?: string;
     createdAt?: string;
     updatedAt?: string;
}

export interface NameProps {
     firstName: string;
     lastName: string;
}
