const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  password: {
    type: String,
    required: [true, "password is required"],
  },
  role: {
    type: String,
    required: [true, "role is required"],
  },
  data: {
    displayName: {
      type: String,
      required: [true, "display name is required"],
    },
    photoUrl: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    settings: {
      layout: {
        style: {
          type: String,
          default: "layout1",
        },
        config: {
          scroll: {
            type: String,
            default: "content",
          },
          mode: {
            type: String,
            default: "fullWidth",
          },
          navbar: {
            display: {
              type: Boolean,
              default: true,
            },
            folded: {
              type: Boolean,
              default: true,
            },
            position: {
              type: String,
              default: "left",
            },
          },
          toolbar: {
            display: {
              type: Boolean,
              default: true,
            },
            style: {
              type: String,
              default: "fixed",
            },
            position: {
              type: String,
              default: "below",
            },
          },
          footer: {
            display: {
              type: Boolean,
              default: true,
            },
            style: {
              type: String,
              default: "fixed",
            },
            position: {
              type: String,
              default: "below",
            },
          },
        },
      },
      customScrollbars: {
        type: Boolean,
        default: true,
      },
      theme: {
        main: {
          type: String,
          default: "default",
        },
        navbar: {
          type: String,
          default: "default",
        },
        toolbar: {
          type: String,
          default: "default",
        },
        footer: {
          type: String,
          default: "default",
        },
      },
    },
    shortcuts: {
      type: [String],
      enum: ["calendar", "mail", "contacts"],
      default: ["calendar", "mail", "contacts"],
    },
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", UserSchema, "users");
