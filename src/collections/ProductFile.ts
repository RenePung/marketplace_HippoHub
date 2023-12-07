import { User } from "../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";

const addUser: BeforeChangeHook = ({ req, data }) => {
    const user = req.user as User | null
    return {...data, user: user?.id}
}

const yourOwnAndPurchased: Access = async ({ req }) => {
    const user = req.user as User | null

    if( user?.role === "admin" ) return true
    if( !user ) return false

    const {} = await req.payload.find({
        collection: "products"
    })
}

export const ProductFiles: CollectionConfig = {
    slug: "product_files",
    admin: {
        hidden: ({ user }) => user.role !== "admin",
    },
    hooks: {
        beforeChange: [addUser]
    },
    access: {
        read: yourOwnAndPurchased
    },
    upload: {
        staticURL: "/product_files",
        staticDir: "product_files",
        mimeTypes: ["image/*", "font/*", "application/postscript"],
    },
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            admin: {
                condition: () => false
            },
            hasMany: false,
            required: true,
        },
    ],
}