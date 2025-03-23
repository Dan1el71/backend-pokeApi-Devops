import prisma from '../config/prisma'

export const savePokemon = async (pokemonData: Pokemon) => {
  const {
    id,
    name,
    height,
    weight,
    habitat,
    baseExperience,
    description,
    image,
    stats,
    sprites,
    evolutionChain,
    abilities,
    moves,
    types,
  } = pokemonData

  const createdSprites = await prisma.pokemonSprites.create({
    data: {
      front_default: sprites.front_default,
      back_default: sprites.back_default,
      front_shiny: sprites.front_shiny,
      back_shiny: sprites.back_shiny,
    },
  })

  for (const evolution of evolutionChain) {
    await prisma.pokemonEvolutionChain.upsert({
      where: { pokemonId: evolution.id },
      update: {
        name: evolution.name,
        image: evolution.image,
      },
      create: {
        pokemonId: evolution.id,
        name: evolution.name,
        image: evolution.image,
      },
    })
  }

  return await prisma.pokemon.create({
    data: {
      id,
      name,
      height,
      weight,
      habitat,
      baseExperience,
      description,
      image,
      pokemonSpritesId: createdSprites.id,
      pokemonEvolutionChainPokemonId: evolutionChain.find((e) => e.id === id)
        ?.id,
      types: {
        connectOrCreate: types.map(({ name }) => ({
          where: {
            name,
          },
          create: {
            name,
          },
        })),
      },
      moves: {
        connectOrCreate: moves.map(({ name }) => ({
          where: {
            name,
          },
          create: {
            name,
          },
        })),
      },
      abilities: {
        connectOrCreate: abilities.map(({ isHidden, name }) => ({
          where: {
            name,
          },
          create: {
            isHidden,
            name,
          },
        })),
      },
      stats: {
        create: stats.map((statData) => ({
          value: statData.value,
          stat: {
            connectOrCreate: {
              where: {
                name: statData.name,
              },
              create: {
                name: statData.name,
              },
            },
          },
        })),
      },
    },

    include: {
      sprites: true,
      evolutionChain: true,
      stats: {
        include: {
          stat: true,
        },
      },
      types: true,
      moves: true,
      abilities: true,
    },
  })
}

export const getPokemonById = async (
  pokemonId: number | string
): Promise<Pokemon | null> => {
  const numId = Number(pokemonId)
  const isNumeric = !isNaN(numId)

  const foundPokemon = await prisma.pokemon.findFirst({
    where: isNumeric ? { id: numId } : { name: pokemonId as string },
    include: {
      sprites: true,
      evolutionChain: true,
      stats: {
        include: {
          stat: true,
        },
      },
      types: true,
      moves: true,
      abilities: true,
    },
  })

  if (!foundPokemon) return null

  const {
    id,
    name,
    height,
    weight,
    habitat,
    baseExperience,
    description,
    image,
  } = foundPokemon

  const abilities: PokemonAbility[] = foundPokemon.abilities.map(
    ({ isHidden, name }) => ({
      isHidden,
      name,
    })
  )
  const moves: PokemonMove[] = foundPokemon.moves.map(({ name }) => ({ name }))
  const types: PokemonType[] = foundPokemon.types.map(({ name }) => ({ name }))
  const stats: PokemonStat[] = foundPokemon.stats.map(({ stat, value }) => ({
    name: stat.name,
    value,
  }))

  const { front_default, back_default, front_shiny, back_shiny } =
    foundPokemon.sprites!

  const sprites: PokemonSprites = {
    front_default,
    back_default,
    front_shiny,
    back_shiny,
  }

  const [prevEvolution, nextEvolution] = await Promise.all([
    prisma.pokemonEvolutionChain.findFirst({
      where: { pokemonId: id - 1 },
    }),
    prisma.pokemonEvolutionChain.findFirst({
      where: { pokemonId: id + 1 },
    }),
  ])

  const evolutionChain: PokemonEvolutionChain[] = [
    prevEvolution && {
      id: prevEvolution.pokemonId,
      name: prevEvolution.name,
      image: prevEvolution.image,
    },
    {
      id,
      name,
      image,
    },
    nextEvolution && {
      id: nextEvolution.pokemonId,
      name: nextEvolution.name,
      image: nextEvolution.image,
    },
  ].filter(Boolean) as PokemonEvolutionChain[]

  return {
    id,
    name,
    height,
    weight,
    habitat,
    baseExperience,
    description,
    image,
    abilities,
    types,
    stats,
    sprites,
    evolutionChain,
    moves,
  }
}

export const pokemonExists = async (id: number | string) => {
  const numId = Number(id)
  const isNumeric = !isNaN(numId)

  return prisma.pokemon.count({
    where: isNumeric ? { id: numId } : { name: id as string },
  })
}
