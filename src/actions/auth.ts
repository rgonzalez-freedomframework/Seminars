'use server'

import { prismaClient } from '@/lib/prismaClient'
import { currentUser } from '@clerk/nextjs/server'

export async function onAuthenticateUser() {
  try {
    const user = await currentUser()

    if (!user) {
      return {
        status: 403,
      }
    }

    // Prefer the primary email address from Clerk
    const primaryEmail =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses[0]?.emailAddress

    if (!primaryEmail) {
      return {
        status: 400,
        message: 'No email address found for user',
      }
    }

    // First, try to find by current Clerk user id
    const userExists = await prismaClient.user.findUnique({
      where: {
        clerkId: user.id,
      },
    })

    if (userExists) {
      return{
        status: 200,
        user: userExists,
      }
    }

    // If not found by clerkId, try to find an existing user by email.
    // This handles the case where a Clerk user was deleted and recreated
    // with the same email but a different Clerk user id.
    const userByEmail = await prismaClient.user.findUnique({
      where: {
        email: primaryEmail,
      },
    })

    let newOrUpdatedUser

    if (userByEmail) {
      // Re-link existing DB user to the new Clerk user id
      newOrUpdatedUser = await prismaClient.user.update({
        where: {
          email: primaryEmail,
        },
        data: {
          clerkId: user.id,
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
          profileImage: user.imageUrl,
          lastLoginAt: new Date(),
        },
      })
    } else {
      // Create a brand new user record
      newOrUpdatedUser = await prismaClient.user.create({
        data: {
          clerkId: user.id,
          email: primaryEmail,
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || primaryEmail,
          profileImage: user.imageUrl,
          lastLoginAt: new Date(),
        },
      })
    }

    if (!newOrUpdatedUser) {
      return {
        status: 500,
        message: 'Failed to create user',
      }
    }

    return {
      status: 201,
      user: newOrUpdatedUser,
    }
  } catch (error) {
    console.log('ERROR',error)
    return {status: 500, error: 'Internal Server Error'}
  }
}