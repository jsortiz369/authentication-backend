-- CreateTable
CREATE TABLE "users_passwords" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_passwords_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "users_sesion" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "refreshTokenHash" VARCHAR(64) NOT NULL,
    "ip" VARCHAR(20),
    "browser" VARCHAR(255),
    "browserVersion" VARCHAR(255),
    "operatingSystem" VARCHAR(255),
    "device" VARCHAR(255),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_sesion_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "users" (
    "_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "names" VARCHAR(50) NOT NULL,
    "surnames" VARCHAR(50) NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "phone" VARCHAR(25) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "failed_attempts" SMALLINT DEFAULT 0,
    "lock_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users_passwords" ADD CONSTRAINT "users_passwords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "users_sesion" ADD CONSTRAINT "users_sesion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
