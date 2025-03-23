-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "habitat" TEXT NOT NULL,
    "baseExperience" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "pokemonSpritesId" INTEGER,
    "pokemonEvolutionChainPokemonId" INTEGER,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonAbility" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL,

    CONSTRAINT "PokemonAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PokemonType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonStat" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "statId" INTEGER NOT NULL,
    "pokemonId" INTEGER NOT NULL,

    CONSTRAINT "PokemonStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonSprites" (
    "id" SERIAL NOT NULL,
    "front_default" TEXT,
    "back_default" TEXT,
    "front_shiny" TEXT,
    "back_shiny" TEXT,

    CONSTRAINT "PokemonSprites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Move" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonEvolutionChain" (
    "pokemonId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "PokemonEvolutionChain_pkey" PRIMARY KEY ("pokemonId")
);

-- CreateTable
CREATE TABLE "_PokemonAbilities" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PokemonAbilities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PokemonTypes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PokemonTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PokemonMoves" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PokemonMoves_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_name_key" ON "Pokemon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_pokemonSpritesId_key" ON "Pokemon"("pokemonSpritesId");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonAbility_name_key" ON "PokemonAbility"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonType_name_key" ON "PokemonType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stat_name_key" ON "Stat"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Move_name_key" ON "Move"("name");

-- CreateIndex
CREATE INDEX "_PokemonAbilities_B_index" ON "_PokemonAbilities"("B");

-- CreateIndex
CREATE INDEX "_PokemonTypes_B_index" ON "_PokemonTypes"("B");

-- CreateIndex
CREATE INDEX "_PokemonMoves_B_index" ON "_PokemonMoves"("B");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_pokemonSpritesId_fkey" FOREIGN KEY ("pokemonSpritesId") REFERENCES "PokemonSprites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_pokemonEvolutionChainPokemonId_fkey" FOREIGN KEY ("pokemonEvolutionChainPokemonId") REFERENCES "PokemonEvolutionChain"("pokemonId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonStat" ADD CONSTRAINT "PokemonStat_statId_fkey" FOREIGN KEY ("statId") REFERENCES "Stat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonStat" ADD CONSTRAINT "PokemonStat_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonAbilities" ADD CONSTRAINT "_PokemonAbilities_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonAbilities" ADD CONSTRAINT "_PokemonAbilities_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonAbility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonTypes" ADD CONSTRAINT "_PokemonTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonTypes" ADD CONSTRAINT "_PokemonTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "PokemonType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonMoves" ADD CONSTRAINT "_PokemonMoves_A_fkey" FOREIGN KEY ("A") REFERENCES "Move"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonMoves" ADD CONSTRAINT "_PokemonMoves_B_fkey" FOREIGN KEY ("B") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
