-- CreateTable
CREATE TABLE "gothram" (
    "id" SERIAL NOT NULL,
    "name_en" VARCHAR(200) NOT NULL,
    "name_ml" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gothram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "illam" (
    "id" SERIAL NOT NULL,
    "name_en" VARCHAR(200) NOT NULL,
    "name_ml" VARCHAR(200) NOT NULL,
    "gothram_id" INTEGER NOT NULL,
    "gramam_id" INTEGER NOT NULL,
    "vedam_id" INTEGER NOT NULL,
    "phone" VARCHAR(15),
    "address" VARCHAR(255),
    "district" VARCHAR(100),
    "state" VARCHAR(100),
    "pincode" VARCHAR(10),
    "maps_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "illam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profession" (
    "id" SERIAL NOT NULL,
    "name_en" VARCHAR(200) NOT NULL,
    "name_ml" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "namboodiri" (
    "id" SERIAL NOT NULL,
    "name_en" VARCHAR(200) NOT NULL,
    "name_ml" VARCHAR(200) NOT NULL,
    "illam_id" INTEGER NOT NULL,
    "profession_id" INTEGER NOT NULL,
    "dob" DATE NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "phone" VARCHAR(15),
    "address" VARCHAR(255),
    "district" VARCHAR(100),
    "state" VARCHAR(100),
    "pincode" VARCHAR(10),
    "email" VARCHAR(100),
    "maps_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "namboodiri_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "illam" ADD CONSTRAINT "illam_gothram_id_fkey" FOREIGN KEY ("gothram_id") REFERENCES "gothram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "illam" ADD CONSTRAINT "illam_gramam_id_fkey" FOREIGN KEY ("gramam_id") REFERENCES "gramam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "illam" ADD CONSTRAINT "illam_vedam_id_fkey" FOREIGN KEY ("vedam_id") REFERENCES "vedam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "namboodiri" ADD CONSTRAINT "namboodiri_illam_id_fkey" FOREIGN KEY ("illam_id") REFERENCES "illam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "namboodiri" ADD CONSTRAINT "namboodiri_profession_id_fkey" FOREIGN KEY ("profession_id") REFERENCES "profession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
