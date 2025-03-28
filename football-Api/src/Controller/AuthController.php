<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class AuthController extends AbstractController
{
    #[Route('/api/login_check', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, JWTTokenManagerInterface $JWTManager, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {

        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;


        if (null === $email || null === $password) {
            return new JsonResponse(['message' => 'Email and password are required'], JsonResponse::HTTP_BAD_REQUEST);
        }


        $user = $userRepository->findOneBy(['email' => $email]);


        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['message' => 'Invalid credentials'], JsonResponse::HTTP_UNAUTHORIZED);
        }


        return new JsonResponse([
            'token' => $JWTManager->create($user),
            'user' => [
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ]
        ]);
    }


    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        ManagerRegistry $doctrine,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);


        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse([
                'message' => 'Email and password are required'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($passwordHasher->hashPassword($user, $data['password']));


        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }


        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }

            return new JsonResponse([
                'message' => 'Validation failed',
                'errors' => $errorMessages
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $em = $doctrine->getManager();
        $em->persist($user);
        $em->flush();

        return new JsonResponse([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername()
            ]
        ], JsonResponse::HTTP_CREATED);
    }
}
