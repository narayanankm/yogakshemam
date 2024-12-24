-- CreateTable
CREATE TABLE "vedam" (
    "id" SERIAL NOT NULL,
    "name_en" VARCHAR(200) NOT NULL,
    "name_ml" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vedam_pkey" PRIMARY KEY ("id")
);
